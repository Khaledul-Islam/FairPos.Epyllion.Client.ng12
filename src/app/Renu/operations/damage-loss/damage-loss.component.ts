import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { EnvService } from '@env/environment';
import { Buy } from '@app/models/Buy';
import { DamageLoss } from '@app/models/damageLoss';
import { DamageModalComponent } from '../damage-loss/damage-modal/damage-modal.component';
import { CredentialsService } from '@app/auth';
import { DataTablesResponse } from '@app/models/DataTablesResponse';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-damage-loss',
  templateUrl: './damage-loss.component.html',
  styleUrls: ['./damage-loss.component.scss'],
})
export class DamageLossComponent implements OnInit {
  public supplierList = [];
  public buydDetails: Buy;
  public damageLossList: DamageLoss[];
  public damageLoss: DamageLoss;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: any;

  public TotalQTY = 0;
  public count = 0;
  public clearflag: boolean | undefined;
  public UserID: string | undefined;
  public ShopID: string | undefined;

  @ViewChild(DamageModalComponent) childItemComponent: any;

  constructor(
    private http: HttpClient,
    private env: EnvService,
    private alertService: AlertService,
    private credentialsService: CredentialsService
  ) {
    this.buydDetails = new Buy();
    this.damageLoss = new DamageLoss();
    this.damageLossList = [];
  }
  receiveItemSelection($event: any) {
    this.buydDetails = $event;
    this.clearflag = true;
  }

  calculateBox(box: any) {
    this.buydDetails.Qty = box * Number(this.buydDetails.BoxSize);
  }
  calculateQTY(qty: any) {
    this.buydDetails.bQty = qty / Number(this.buydDetails.BoxSize);
  }
  async GetProductSupplier(sBarcode: any) {
    if (sBarcode) {
      if (this.buydDetails.IsDamageStock === null || this.buydDetails.IsDamageStock === undefined) {
        this.alertService.warning('Select Stock');
        return;
      }
      await this.GetByBarcodeExp(sBarcode);
    } else {
      if (this.buydDetails.SupID === null || this.buydDetails.SupID === undefined) {
        this.alertService.warning('Supplier is Required');
        return;
      }
      if (this.buydDetails.IsDamageStock === null || this.buydDetails.IsDamageStock === undefined) {
        this.alertService.warning('Select Stock');
        return;
      }
      this.childItemComponent.clickFromParent(this.buydDetails.SupID, this.ShopID, this.buydDetails.IsDamageStock);
    }
  }
  IsDamageStock(item: any) {
    this.buydDetails.IsDamageStock = item;
  }
  async SupplierDDL() {
    let promise = this.http.get(this.env.apiUrl + 'api/Supplier').toPromise();
    return promise
      .then((resp) => {
        this.supplierList = resp as any;
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  async GetStockDMLTempbyBarcode() {
    let promise = this.http
      .get(this.env.apiUrl + 'DamageLoss/GetStockDMLTemp?BarCode=' + this.buydDetails.BarCode)
      .toPromise();
    return promise.then((response) => {
      return (this.damageLoss = response as DamageLoss);
    });
  }
  // async GetTempDataByUser() {
  //   let promise = this.http.get(this.env.apiUrl + 'DamageLoss/GetTempDataByUser?UserID=' + this.UserID + '&ShopID=' + this.ShopID).toPromise();
  //   return promise.then(response => {
  //     return this.damageLossList = response as DamageLoss[];
  //   })
  // }
  async GetByBarcodeExp(BarCode: any) {
    let linkurl = '';
    if (this.buydDetails.IsDamageStock === true) {
      linkurl = 'DamageLoss/GetDamageBarcodeExp?expbarcode=' + BarCode;
    }
    if (this.buydDetails.IsDamageStock === false) {
      linkurl = 'ItemConversion/GetByBarcodeExp?expbarcode=' + BarCode;
    }
    let promise = this.http.get(this.env.apiUrl + linkurl).toPromise();
    return promise.then((response) => {
      this.buydDetails = response as Buy;
      return this.buydDetails;
    });
  }
  async AddButonClick() {
    if (this.buydDetails.BarCode === null && this.buydDetails.sBarCode === null) {
      this.alertService.warning('No Product Found');
      return;
    }
    if (
      (this.buydDetails.bQty === null && this.buydDetails.Qty === null) ||
      (this.buydDetails.bQty === undefined && this.buydDetails.Qty === undefined)
    ) {
      this.alertService.warning('Select Quantity');
      return;
    }
    if (this.buydDetails.SupID === null || this.buydDetails.SupID === undefined) {
      this.alertService.warning('Supplier is Required');
      return;
    }
    if (Number(this.buydDetails.balQty) <= 0) {
      this.alertService.warning('Stock Not available');
      return;
    }
    if (Number(this.buydDetails.Qty) > Number(this.buydDetails.balQty)) {
      this.alertService.warning('Stock Limit excceed');
      return;
    }
    if (await this.GetStockDMLTempbyBarcode()) {
      if (this.damageLoss.UserID === this.UserID) {
        this.alertService.warning('Another user already added this item');
        return;
      }
    }
    await this.TempDMLSave();
    this.buydDetails = new Buy();
    this.damageLoss = new DamageLoss();
  }
  async TempDMLSave() {
    this.buydDetails.ShopID = this.ShopID;
    this.buydDetails.UserID = this.UserID;
    let promise = this.http.post(this.env.apiUrl + 'DamageLoss/StockDMLTempSave', this.buydDetails).toPromise();
    return promise
      .then((res) => {
        this.rerender();
        return res;
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  async reportAPICall(idNo: string, header: string) {
    var url_ = this.env.reportUrl + 'Stock/StockDMLByChln?Chln=' + idNo + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  async saveButtonClick() {
    if (this.damageLossList.length <= 0) {
      this.alertService.warning('No data to save');
      return;
    }
    this.alertService.confirm('are you sure you want to Save this data', () => {
      let promise = this.http
        .post(this.env.apiUrl + 'DamageLoss/StockDMLSave', this.damageLossList, { responseType: 'text' })
        .toPromise();
      return promise
        .then((res) => {
          this.reportAPICall(res, '=');
          this.buydDetails = new Buy();
          this.GetTempDataByUser();
          this.rerender();
          this.alertService.success('Succefully Saved');
          return res;
        })
        .catch((error) => {
          this.alertService.error(error.error);
        });
    });
  }
  backButtonClick() {
    this.buydDetails = new Buy();
  }
  async deleteButtonClick(item: DamageLoss) {
    this.alertService.confirm('are you sure you want to remove this data', () => {
      let promise = this.http.post(this.env.apiUrl + 'DamageLoss/StockDMLTempDelete', item).toPromise();
      return promise.then((resp) => {
        this.rerender();
        this.alertService.success('Data Delete Successfully');
        this.TotalQTY = 0;
        return resp;
      });
    });
  }
  GetTempDataByUser() {
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
        that.http
          .post<DataTablesResponse>(this.env.apiUrl + 'DamageLoss/GetTempDataTable', dataTablesParameters, {})
          .subscribe((resp) => {
            that.damageLossList = resp.data as DamageLoss[];
            that.count = that.damageLossList.length;
            that.damageLossList.forEach((element) => {
              this.TotalQTY += Number(element.Qty);
            });
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: 'BarCode' },
        { data: 'PrdName' },
        { data: 'RPU' },
        { data: 'BoxQty' },
        { data: 'UnitUOM' },
        { data: 'Qty' },
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
    this.GetTempDataByUser();
    if (this.damageLossList.length > 0) {
      this.buydDetails.SupID = this.damageLossList[0].SupID;
    }
  }
}
