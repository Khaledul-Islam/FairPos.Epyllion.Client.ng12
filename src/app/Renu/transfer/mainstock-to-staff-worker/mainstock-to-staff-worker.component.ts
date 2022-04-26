import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';
import { Buy } from '@app/models/Buy';
import { TempStockTransfer } from '@app/models/TempStockTransfer';
import { TransferModalComponent } from './transfer-modal/transfer-modal.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataTablesResponse } from '@app/models/DataTablesResponse';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-mainstock-to-staff-worker',
  templateUrl: './mainstock-to-staff-worker.component.html',
  styleUrls: ['./mainstock-to-staff-worker.component.scss'],
})
export class MainstockToStaffWorkerComponent implements OnInit {
  public buyDetails: Buy;
  public TempStockTransfer: TempStockTransfer;
  public TempStockTransferList: TempStockTransfer[];
  public supplierList = [];
  public stockList = [
    // {
    //   Name: "Main Stock",
    //   Value: "Main Stock",
    // },
    {
      Name: 'Staff Stock',
      Value: 'Staff Stock',
    },
    {
      Name: 'Worker Stock',
      Value: 'Worker Stock',
    },
  ];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: any;

  public TotalQTY = 0;
  public count = 0;
  public UserID: string | undefined;
  public ShopID: string | undefined;
  public stocktype: string | undefined;

  public APIURL = {
    parent: 'MainToStaffWorker/GetTransferProducts',
    child: 'MainToStaffWorker/GetTransferNewBarcode',
    details: 'MainToStaffWorker/GetTransferBarcodeExp',
  };

  @ViewChild(TransferModalComponent) childItemComponent: any;

  constructor(
    private http: HttpClient,
    private env: EnvService,
    private alertService: AlertService,
    private credentialsService: CredentialsService
  ) {
    this.buyDetails = new Buy();
    this.TempStockTransfer = new TempStockTransfer();
    this.TempStockTransferList = [];
  }
  receiveItemSelection($event: any) {
    this.buyDetails = $event;
    this.buyDetails.stocktype = this.stocktype;
  }
  calculateBox(box: any) {
    if (this.buyDetails.sBarCode === null || this.buyDetails.sBarCode === undefined) {
      this.alertService.warning('No Item Found');
      return;
    }
    this.buyDetails.reqqty = box * Number(this.buyDetails.BoxSize);
  }
  async GetTransferBarcodeExpMain(Barcode: any) {
    let promise = this.http
      .get(this.env.apiUrl + 'MainToStaffWorker/GetTransferBarcodeExp?expbarcode=' + Barcode)
      .toPromise();
    return promise.then((response) => {
      this.buyDetails = response as Buy;
      this.buyDetails.stocktype = this.stocktype;
      return this.buyDetails;
    });
  }
  async TransferModal(sBarcode: any) {
    if (sBarcode) {
      if (this.buyDetails.SupID === null || this.buyDetails.SupID === undefined) {
        this.alertService.warning('Supplier is Required');
        return;
      }
      if (this.stocktype === null || this.stocktype === undefined) {
        this.alertService.warning('Select Transfer to which department');
        return;
      }
      await this.GetTransferBarcodeExpMain(sBarcode);
    } else {
      if (this.buyDetails.SupID === null || this.buyDetails.SupID === undefined) {
        this.alertService.warning('Supplier is Required');
        return;
      }
      if (this.stocktype === null || this.stocktype === undefined) {
        this.alertService.warning('Select Transfer to which department');
        return;
      }
      this.childItemComponent.clickFromParent(this.buyDetails.SupID, this.ShopID, this.APIURL);
    }
  }
  async SupplierDDL() {
    let promise = this.http.get(this.env.apiUrl + 'api/Supplier').toPromise();
    return promise
      .then((res) => {
        return (this.supplierList = res as any);
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }
  async GetTempStock() {
    let promise = this.http
      .get(
        this.env.apiUrl +
          'MainToStaffWorker/GetTempStock?Barcode=' +
          this.buyDetails.BarCode +
          '&stockType=' +
          this.stocktype
      )
      .toPromise();
    return promise.then((res) => {
      return (this.TempStockTransfer = res as TempStockTransfer);
    });
  }
  async SaveTempStockTransfer() {
    this.buyDetails.ShopID = this.ShopID;
    this.buyDetails.UserID = this.UserID;
    let promise = this.http
      .post(this.env.apiUrl + 'MainToStaffWorker/SaveTempStockTransfer', this.buyDetails)
      .toPromise();
    return promise
      .then((res) => {
        this.rerender();
        return res;
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  async AddButonClick() {
    if (this.buyDetails.SupID === null || this.buyDetails.SupID === undefined) {
      this.alertService.warning('Supplier is Required');
      return;
    }
    await this.GetTempStock();
    if (this.TempStockTransfer != null) {
      if (this.TempStockTransfer.UserId != this.UserID) {
        this.alertService.warning('Another user already added this item');
        return;
      }
    }
    if (this.stocktype === null || this.stocktype === undefined) {
      this.alertService.warning('Select Transfer Store');
      return;
    }
    if (this.buyDetails.BarCode === null && this.buyDetails.sBarCode === null) {
      this.alertService.warning('No Product Found');
      return;
    }
    if (Number(this.buyDetails.balQty) <= 0) {
      this.alertService.warning('Stock Not available');
      return;
    }
    if (Number(this.buyDetails.reqqty) > Number(this.buyDetails.balQty)) {
      this.alertService.warning('Stock Limit excceed');
      return;
    }
    if (Number(this.buyDetails.reqqty) <= 0) {
      this.alertService.warning('Enter transfer Qty');
      return;
    }
    await this.SaveTempStockTransfer();
    this.buyDetails = new Buy();
    this.TempStockTransfer = new TempStockTransfer();
  }
  async reportAPICall(idNo: string, header: string) {
    var url_ = this.env.reportUrl + 'Stock/StockTransferByChln?Chln=' + idNo + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  async saveButtonClick() {
    if (this.TempStockTransferList.length <= 0) {
      this.alertService.warning('No data to save');
      return;
    }
    this.alertService.confirm('are you sure you want to Save this data', () => {
      let promise = this.http
        .post(this.env.apiUrl + 'MainToStaffWorker/SaveStockTransfer', this.TempStockTransferList, {
          responseType: 'text',
        })
        .toPromise();
      return promise
        .then((res) => {
          this.buyDetails = new Buy();
          this.TempStockTransfer = new TempStockTransfer();
          this.rerender();
          this.alertService.success('Succefully Saved');
          this.reportAPICall(res, '=');
          return res;
        })
        .catch((error) => {
          this.alertService.error(error.error);
        });
    });
  }
  backButtonClick() {
    this.buyDetails = new Buy();
    this.TempStockTransfer = new TempStockTransfer();
    this.TempStockTransferList = [];
    this.TotalQTY = 0;
    this.count = 0;
  }
  async deleteButtonClick(item: TempStockTransfer) {
    this.alertService.confirm('Are you sure to delete ' + item.ProdcutDescription, () => {
      let promise = this.http.post(this.env.apiUrl + 'MainToStaffWorker/DeleteTempStockTransfer', item).toPromise();
      return promise
        .then((res) => {
          this.alertService.success(item.ProdcutDescription + ' Deleted');
          this.count = 0;
          this.TotalQTY = 0;
          this.rerender();
          return res;
        })
        .catch((err) => {
          this.alertService.error(err.error);
        });
    });
  }
  LoadDataTable() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      searching: false,
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.search.username = this.UserID;
        dataTablesParameters.search.branchid = this.ShopID;
        dataTablesParameters.search.vendorno = 'Main Stock';
        that.http
          .post<DataTablesResponse>(this.env.apiUrl + 'MainToStaffWorker/GetTempDataTable', dataTablesParameters, {})
          .subscribe((resp) => {
            that.TempStockTransferList = resp.data as TempStockTransfer[];
            if (this.TempStockTransferList.length > 0) {
              that.count = that.TempStockTransferList.length;
              this.buyDetails.SupID = this.TempStockTransferList[0].SupID;
              this.buyDetails.stocktype = this.TempStockTransferList[0].TransferTo;
              this.stocktype = this.TempStockTransferList[0].TransferTo;
              that.TempStockTransferList.forEach((element) => {
                this.TotalQTY += Number(element.TQty);
              });
            }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: 'BarCode' },
        { data: 'ProdcutDescription' },
        { data: 'RPU' },
        { data: 'BoxQty' },
        { data: 'UnitUOM' },
        { data: 'TQty' },
        { data: 'BoxUOM' },
        { data: 'IsGiftItemAvailable' },
        { defaultContent: '', data: 'Empty', orderable: false },
      ],
    };
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  ngOnInit(): void {
    this.SupplierDDL();
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.LoadDataTable();
  }
}
