import { Component, OnInit, ViewChild } from '@angular/core';
import { ArrivalTemp } from '@app/models/ArrivalTemp';
import { CredentialsService } from '@app/auth/credentials.service';
import { BuyOrderTemp } from '@app/models/BuyOrderTemp';
import { Supplier } from '@app/models/Supplier';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';
import { ArrivalModalComponent } from '../arrival/arrival-modal/arrival-modal.component';
import { Subject } from 'rxjs';
import { PurchaseOrder } from '@app/models/PurchaseOrder';
import { DataTableDirective } from 'angular-datatables';
import { DataTablesResponse } from '@app/models/DataTablesResponse';
import { GlobalSetup } from '@app/models/GlobalSetup';

@Component({
  selector: 'app-arrival',
  templateUrl: './arrival.component.html',
  styleUrls: ['./arrival.component.scss'],
})
export class ArrivalComponent implements OnInit {
  public SupplierList = [];
  public POList = [];
  public GetChallanList: BuyOrderTemp[];
  public ArrivalTemp: ArrivalTemp;
  public softwareSetting: GlobalSetup;
  public ArrivalTempList: ArrivalTemp[];
  public UserID: string | undefined;
  public ShopID: string | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: any;

  @ViewChild(ArrivalModalComponent) childItemComponent: any;

  public GrantTotal = 0;
  public GrantQuantity = 0;
  public ItemQuantity = 0;
  public userName = '';
  public OrderDate = new Date();

  public SupplierInfo: Supplier;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {
    this.ArrivalTemp = new ArrivalTemp();
    this.ArrivalTempList = [];
    this.GetChallanList = [];
    this.SupplierInfo = new Supplier();
    this.softwareSetting = new GlobalSetup();
  }
  receiveItemSelection($event: any) {
    let item = $event as PurchaseOrder;
    this.GetProductDetails(item.Barcode);
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  GetProductStock(sBarcode: any) {
    this.http
      .get(this.env.apiUrl + 'PurchaseOrder/GetActualStockBySbarocde?sBarcode=' + sBarcode, { responseType: 'text' })
      .subscribe(
        (result) => {
          this.ArrivalTemp.totalstock = result as any;
        },
        (error) => {
          this.alertService.error(error.error);
        }
      );
  }
  GetProductDetails(Barcode: any) {
    if (Barcode) {
      this.http.get(this.env.apiUrl + 'ItemList/ApprovedItembyBarcode?barocde=' + Barcode).subscribe(
        (result) => {
          if (result === null || result === undefined) {
            this.alertService.error('Invalid/UnAuthorized Item');
            return;
          }
          this.ArrivalTemp = result as ArrivalTemp;
          this.ArrivalTemp.BarCode = Barcode;
          this.GetProductStock(this.ArrivalTemp.sBarCode);
          this.ChangeSupplier(this.ArrivalTemp.SupID);
          //this.CheckStatus();
          this.Initialize();
        },
        (error) => {
          this.alertService.error(error.error);
        }
      );
    } else {
      if (this.ArrivalTemp.SupID === null || this.ArrivalTemp.SupID === undefined) {
        this.alertService.warning('Supplier is Required');
        return;
      }
      this.childItemComponent.clickFromParent(this.ArrivalTemp.SupID);
    }
  }
  Initialize() {
    if (this.ArrivalTempList.length > 0) {
      this.ArrivalTemp.SupID = this.ArrivalTempList[0].SupID;
      this.ArrivalTemp.Chln = this.ArrivalTempList[0].Chln;
      this.ArrivalTemp.date = this.formatCurrentDate(new Date()) as any;
      this.ArrivalTemp.rdate = this.formatCurrentDate(new Date()) as any;
    }
    this.ArrivalTemp.date = this.formatCurrentDate(new Date()) as any;
    this.ArrivalTemp.rdate = this.formatCurrentDate(new Date()) as any;
    return;
  }
  GetTempArrivalList() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: false,
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.search.username = this.UserID;
        that.http
          .post<DataTablesResponse>(this.env.apiUrl + 'ArrivalCheck/GetTempDataTable', dataTablesParameters, {})
          .subscribe((resp) => {
            this.ArrivalTempList = resp.data as ArrivalTemp[];
            this.ArrivalTempList.forEach((element) => {
              let sum = Number(element.RPU) * Number(element.PoQty);
              this.GrantTotal = Number(this.GrantTotal) + sum;
              this.ItemQuantity = Number(this.ItemQuantity) + Number(element.PoQty);
              element.EXPDT = this.formatCurrentDate2(element.EXPDT);
            });
            //this.ChangeSupplier(this.PurchaseOrderTemp.SupID)
            this.GrantQuantity = this.ArrivalTempList.length;
            this.Initialize();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: 'BarCode' },
        { data: 'ItemFullName' },
        { data: 'RPU' },
        { data: 'POBoxQty' },
        { data: 'PoQty' },
        { data: 'BoxQty' },
        { data: 'UnitUOM' },
        { data: 'BoxUOM' },
        { data: 'GIFT_RATIO' },
        { data: 'GIFT_DESCRIPTION' },
        { data: 'EXPDT' },
        { defaultContent: '', data: 'Empty', orderable: false },
      ],
    };
  }
  async GetTempArrivalByChallanNo(chln: any) {
    const promise = this.http.get(this.env.apiUrl + 'ArrivalCheck/GetTempArrivalByChallanNo?chln=' + chln).toPromise();
    return promise.then(
      (response: any) => {
        return (this.ArrivalTempList = response);
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }
  async GetChallanDetails(POno: any) {
    const promise = this.http.get(this.env.apiUrl + 'ArrivalCheck/GetChallanDetails?POno=' + POno).toPromise();
    return promise.then(
      (response: any) => {
        return (this.GetChallanList = response as BuyOrderTemp[]);
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }
  async supplierDDL() {
    const promise = this.http
      .get(this.env.apiUrl + 'ArrivalCheck/GetACSupplierDDL?UserID=' + this.UserID + '&ShopID=' + this.ShopID)
      .toPromise();
    return promise.then(
      (response: any) => {
        return (this.SupplierList = response);
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }
  async ChangeSupplier(SupID: any) {
    const promise = this.http
      .get(this.env.apiUrl + 'ArrivalCheck/GetPendingPONo?SupID=' + SupID + '&ShopID=' + this.ShopID)
      .toPromise();
    return promise.then(
      (response: any) => {
        return (this.POList = response);
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }
  async AddProduct() {
    if (this.ArrivalTemp.SupID === null || this.ArrivalTemp.SupID === undefined) {
      this.alertService.warning('Supplier id is required');
      return;
    }
    if (this.ArrivalTemp.BarCode === null || this.ArrivalTemp.BarCode === undefined) {
      this.alertService.warning('Barcode is required');
      return;
    }

    if (this.ArrivalTemp.PackSizeQTY === null || this.ArrivalTemp.PackSizeQTY === undefined) {
      this.alertService.warning('Pack Size is required');
      return;
    }
    let index = this.ArrivalTempList.findIndex((obj) => {
      return obj.BarCode === this.ArrivalTemp.BarCode;
    });
    if (index > -1) {
      this.alertService.warning('Item Already Exist');
      this.alertService.warning('Please Try Another');
      return;
    }
    if (this.softwareSetting.IS_ARR_ENABLE) {
      var currentDate = new Date().toJSON().slice(0, 10);
      var from = new Date(this.softwareSetting.ARR_FROMDATE as any);
      var to = new Date(this.softwareSetting.ARR_TODATE as any);
      var check = new Date(currentDate);
      const month = check.toLocaleString('default', { month: 'long' });
      if (check.getDate() >= from.getDate() && check.getDate() <= to.getDate()) {
        await this.saveTempArrivalSingleItem(this.ArrivalTemp);
        this.GetTempArrivalList();
        this.rerender();
      } else {
        this.alertService.error(
          'Arrival blocked by Administrator.</br> Allowed date range </br> FROM : ' +
            month +
            ' ' +
            from.getDate() +
            '</br>  TO : ' +
            month +
            ' ' +
            to.getDate()
        );
        return;
      }
    }
    if (this.softwareSetting.IS_ARR_ENABLE == false) {
      await this.saveTempArrivalSingleItem(this.ArrivalTemp);
      this.GetTempArrivalList();
      this.rerender();
    }
  }
  async LoadProduct() {
    if (this.ArrivalTemp.SupID === undefined || this.ArrivalTemp.SupID === null) {
      this.alertService.warning('Select Supplier ID.');
      return;
    }
    if (this.ArrivalTemp.Chln === undefined || this.ArrivalTemp.Chln === null) {
      this.alertService.warning('Select P/O Number.');
      return;
    }
    let result = await this.GetTempArrivalByChallanNo(this.ArrivalTemp.Chln);
    if (result.length > 0) {
      this.alertService.warning('This PO is already processing by another user');
      return;
    }
    if (this.softwareSetting.IS_ARR_ENABLE) {
      var currentDate = new Date().toJSON().slice(0, 10);
      var from = new Date(this.softwareSetting.ARR_FROMDATE as any);
      var to = new Date(this.softwareSetting.ARR_TODATE as any);
      var check = new Date(currentDate);
      const month = check.toLocaleString('default', { month: 'long' });
      if (check.getDate() >= from.getDate() && check.getDate() <= to.getDate()) {
        await this.GetChallanDetails(this.ArrivalTemp.Chln);
        await this.saveTempArrivalItem(this.GetChallanList);
        this.GetTempArrivalList();
        this.rerender();
      } else {
        this.alertService.error(
          'Arrival blocked by Administrator.</br> Allowed date range </br> FROM : ' +
            month +
            ' ' +
            from.getDate() +
            '</br>  TO : ' +
            month +
            ' ' +
            to.getDate()
        );
        return;
      }
    }
    if (this.softwareSetting.IS_ARR_ENABLE == false) {
      await this.GetChallanDetails(this.ArrivalTemp.Chln);
      await this.saveTempArrivalItem(this.GetChallanList);
      this.GetTempArrivalList();
      this.rerender();
    }
  }
  async saveTempArrivalSingleItem(item: ArrivalTemp) {
    item.UserID = this.UserID;
    item.ShopID = this.ShopID;
    const promise = this.http.post(this.env.apiUrl + 'ArrivalCheck/saveTempArrivalSingleItem', item).toPromise();
    return promise.then(
      (response: any) => {
        this.ArrivalTemp = new ArrivalTemp();
        return response;
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }
  async saveTempArrivalItem(item: BuyOrderTemp[]) {
    item.forEach((element) => {
      element.UserID = this.UserID;
      element.ShopID = this.ShopID;
    });
    const promise = this.http.post(this.env.apiUrl + 'ArrivalCheck/SaveTempArrival', item).toPromise();
    return promise.then(
      (response: any) => {
        return response;
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }
  formatCurrentDate(date: any) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    //var today = day + "-" + month + "-" + year;
    var today = year + '-' + month + '-' + day;
    return today;
  }
  async GetSoftwareSetting() {
    let promise = this.http.get(this.env.apiUrl + 'api/ShopList/GetSoftwareSetting?storeID=' + this.ShopID).toPromise();
    return promise
      .then((resp) => {
        this.softwareSetting = resp as GlobalSetup;
        return this.softwareSetting;
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  async saveButtonClick() {
    let flag = false;
    if (this.ArrivalTemp.RefChallanNo === null || this.ArrivalTemp.RefChallanNo === undefined) {
      this.alertService.warning('Refference Challan is required');
      flag = true;
      return;
    }
    if (this.softwareSetting.IS_ARR_ENABLE) {
      var currentDate = new Date().toJSON().slice(0, 10);
      var from = new Date(this.softwareSetting.ARR_FROMDATE as any);
      var to = new Date(this.softwareSetting.ARR_TODATE as any);
      var check = new Date(currentDate);
      const month = check.toLocaleString('default', { month: 'long' });
      if (check.getDate() >= from.getDate() && check.getDate() <= to.getDate()) {
        this.alertService.confirm('are you sure you want to save this data', async () => {
          this.ArrivalTempList.forEach((element) => {
            element.RefChallanNo = this.ArrivalTemp.RefChallanNo;
            element.cbDebitNote = this.ArrivalTemp.cbDebitNote;
            element.date = this.ArrivalTemp.date;
            element.rdate = this.ArrivalTemp.rdate;
            element.ShopID = this.ShopID;
            let today = new Date().toJSON().slice(0, 10) as any;
            if (element.EXPDT == today) {
              this.alertService.warning('please change expire date , Barcode: ' + element.BarCode);
              flag = true;
              return;
            }
            if (element.Chln !== 'FREE') {
              if (Number(element.PrvRcvBox) + Number(element.BoxQty) > Number(element.POBoxQty)) {
                this.alertService.warning('Receive qty can not greater then PO qty , Barcode: ' + element.BarCode);
                flag = true;
                return;
              }
            }
          });
          if (flag == false) {
            await this.SaveAPI();
          }
        });
      } else {
        this.alertService.error(
          'Arrival blocked by Administrator.</br> Allowed date range </br> FROM : ' +
            month +
            ' ' +
            from.getDate() +
            '</br>  TO : ' +
            month +
            ' ' +
            to.getDate()
        );
        return;
      }
    }
    if (this.softwareSetting.IS_ARR_ENABLE == false) {
      this.alertService.confirm('are you sure you want to save this data', async () => {
        this.ArrivalTempList.forEach((element) => {
          element.RefChallanNo = this.ArrivalTemp.RefChallanNo;
          element.cbDebitNote = this.ArrivalTemp.cbDebitNote;
          element.date = this.ArrivalTemp.date;
          element.rdate = this.ArrivalTemp.rdate;
          element.ShopID = this.ShopID;
          let today = new Date().toJSON().slice(0, 10) as any;
          if (element.EXPDT == today) {
            this.alertService.warning('please change expire date , Barcode: ' + element.BarCode);
            flag = true;
            return;
          }
          if (element.Chln !== 'FREE') {
            if (Number(element.PrvRcvBox) + Number(element.BoxQty) > Number(element.POBoxQty)) {
              this.alertService.warning('Receive qty can not greater then PO qty , Barcode: ' + element.BarCode);
              flag = true;
              return;
            }
          }
        });
        if (flag == false) {
          await this.SaveAPI();
        }
      });
    }
  }
  async reportAPICall(arrivalno: string, header: string) {
    var url_ =
      this.env.reportUrl + 'Arrival/ArrivalChallanWise?ARRIVAL_NO=' + arrivalno + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }

  async SaveAPI() {
    const promise = this.http
      .post(this.env.apiUrl + 'ArrivalCheck/SaveArrival', this.ArrivalTempList, { responseType: 'text' })
      .toPromise();
    return promise
      .then((resp) => {
        this.alertService.success('Data Saved Successfull');
        this.ArrivalTemp = new ArrivalTemp();
        this.ArrivalTempList = [];
        this.GetChallanList = [];
        this.SupplierInfo = new Supplier();
        this.rerender();
        this.reportAPICall(resp, 'Arrival Copy');
        return resp;
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }
  clearButtonClick() {
    this.alertService.confirm('Are you sure to clear the data', () => {
      const promise = this.http
        .delete(this.env.apiUrl + 'ArrivalCheck/RemoveTempArrival?UserID=' + this.UserID)
        .toPromise();
      return promise.then(
        (response: any) => {
          this.GetTempArrivalList();
          this.ArrivalTemp = new ArrivalTemp();
          this.ArrivalTempList = [];
          this.GetChallanList = [];
          this.SupplierInfo = new Supplier();
          this.POList = [];
          this.rerender();
          return response;
        },
        (error: any) => {
          this.alertService.error(error.error);
        }
      );
    });
  }
  formatCurrentDate2(date: any) {
    if (!date) return null;
    if (date.includes('T')) {
      let onlyDate = date.split('T');
      const [year, month, day] = onlyDate[0].split('-');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (date.includes('-')) {
      const [year, month, day] = date.split('-');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (date.includes(' ')) {
      let onlyDate = date.split(' ');
      const [month, day, year] = onlyDate[0].split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else return date;
  }
  cancelButtonClick() {
    this.GetTempArrivalList();
    this.ArrivalTemp = new ArrivalTemp();
    this.ArrivalTempList = [];
    this.GetChallanList = [];
    this.SupplierInfo = new Supplier();
    this.POList = [];
    this.rerender();
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
  ngOnInit() {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.ArrivalTemp.date = this.formatCurrentDate(new Date()) as any;
    this.ArrivalTemp.rdate = this.formatCurrentDate(new Date()) as any;
    this.supplierDDL();
    this.GetTempArrivalList();
    this.GetSoftwareSetting();
  }
}
