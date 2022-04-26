import { Component, OnInit, ViewChild } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';
import { AutoRequistionTemp } from '@app/models/AutoRequistionTemp';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { GlobalSetup } from '@app/models/GlobalSetup';

@Component({
  selector: 'app-auto-requisition',
  templateUrl: './auto-requisition.component.html',
  styleUrls: ['./auto-requisition.component.scss'],
})
export class AutoRequisitionComponent implements OnInit {
  public UserID: string | undefined;
  public ShopID: string | undefined;
  public reqTempLst: AutoRequistionTemp[];
  public softwareSetting: GlobalSetup;
  public totalQty = 0;
  public totalAmount = 0;
  public totalItem = 0;
  public monthlyBudget = 0;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: any;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {
    this.reqTempLst = [];
    this.softwareSetting = new GlobalSetup();
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
  cancelButtonClick() {
    this.reqTempLst = [];
    this.GetTempRequistion();
  }
  async SaveButtonClick() {
    if (this.totalAmount > this.monthlyBudget) {
      this.alertService.error('Budget limit exceeded');
      this.alertService.warning('Adjust Budget or Contact to Administrator');
      return;
    }
    let promise = this.http
      .post(this.env.apiUrl + 'AutoRequisition/AutoRequisitionSave', this.reqTempLst, { responseType: 'text' })
      .toPromise();
    return promise
      .then((resp) => {
        this.alertService.success('Requisition Generated Successfully');
        this.reportAPICall(resp, 'N');
        this.reqTempLst = [];
        this.totalQty = 0;
        this.totalAmount = 0;
        this.totalItem = 0;
        return resp;
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }

  ChangeActualBoxQty(item: AutoRequistionTemp) {
    let twenty_percent = Math.round((Number(item.Qty) * 20) / 100);
    let diff_qty = Math.abs(Number(item.Qty) - Number(item.ActualBoxQty));
    if (diff_qty > twenty_percent) {
      this.alertService.warning('Actual requistion qty is greater then 20%');
      item.ActualBoxQty = item.Qty;
      return;
    }
    if (diff_qty <= twenty_percent) {
      this.alertService.confirm('Are you sure to modify the budget', () => {
        let promise = this.http.post(this.env.apiUrl + 'AutoRequisition/UpdateActualQty', item).toPromise();
        return promise
          .then((resp) => {
            this.GetTempRequistion();
            this.alertService.success('Budget Updated');
            return resp;
          })
          .catch((err) => {
            this.alertService.error(err.error);
          });
      });
      return;
    }
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
  async generateButtonClick() {
    if (this.softwareSetting.IS_REQ_ENABLE) {
      var currentDate = new Date().toJSON().slice(0, 10);
      var from = new Date(this.softwareSetting.REQ_FROMDATE as any);
      var to = new Date(this.softwareSetting.REQ_TODATE as any);
      var check = new Date(currentDate);
      const month = check.toLocaleString('default', { month: 'long' });
      if (check.getDate() >= from.getDate() && check.getDate() <= to.getDate()) {
        let promise = this.http
          .get(this.env.apiUrl + 'AutoRequisition/GenerateRequistion?UserID=' + this.UserID + '&ShopID=' + this.ShopID)
          .toPromise();
        return promise
          .then((resp) => {
            this.alertService.success('Suggested Requisition Generated');
            this.GetTempRequistion();
            return resp;
          })
          .catch((err) => {
            this.alertService.error(err.error);
          });
      } else {
        this.alertService.error(
          'Requisition blocked by Administrator.</br> Allowed date range </br> FROM : ' +
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
    if (this.softwareSetting.IS_REQ_ENABLE == false) {
      let promise = this.http
        .get(this.env.apiUrl + 'AutoRequisition/GenerateRequistion?UserID=' + this.UserID + '&ShopID=' + this.ShopID)
        .toPromise();
      return promise
        .then((resp) => {
          this.alertService.success('Suggested Requisition Generated');
          this.GetTempRequistion();
          return resp;
        })
        .catch((err) => {
          this.alertService.error(err.error);
        });
    }
  }
  async GetCurrentMonthShopBudget() {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = new Date().getFullYear();
    let promise = this.http
      .get(
        this.env.apiUrl +
          'MonthlyBudget/GetCurrentMonthShopBudget?year=' +
          year +
          '&month=' +
          month +
          '&ShopID=' +
          this.ShopID
      )
      .toPromise();
    return promise
      .then((resp) => {
        return (this.monthlyBudget = resp as number);
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  async GetTempRequistion() {
    let promise = this.http
      .get(
        this.env.apiUrl + 'AutoRequisition/GetTempRequistionDataByUser?user=' + this.UserID + '&shopid=' + this.ShopID
      )
      .toPromise();
    return promise
      .then((resp) => {
        this.reqTempLst = resp as AutoRequistionTemp[];
        this.totalItem = this.reqTempLst.length;
        this.totalAmount = 0;
        this.reqTempLst.forEach((element) => {
          this.totalQty = this.totalQty + Number(element.ActualBoxQty);
          this.totalAmount = this.totalAmount + Number(element.ActualBoxQty) * Number(element.RPU);
        });
        return this.reqTempLst;
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  async clearButtonClick() {
    this.alertService.confirm('Are you sure to clear the data', () => {
      let promise = this.http
        .get(
          this.env.apiUrl + 'AutoRequisition/RemoveAllTempRequistion?userId=' + this.UserID + '&shopid=' + this.ShopID
        )
        .toPromise();
      return promise
        .then((resp) => {
          this.reqTempLst = [];
          return resp;
        })
        .catch((err) => {
          this.alertService.error(err.error);
        });
    });
  }
  async reportAPICall(chln: any, isTemp: string) {
    var url_ =
      this.env.reportUrl +
      'Requistion/RequistionChallanWise?ChlnNo=' +
      chln +
      '&IsTemp=' +
      isTemp +
      '&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  previewButtonClick() {
    console.log(this.reqTempLst.length == 0);
    if (this.reqTempLst.length == 0) {
      this.alertService.warning('Generate Requisition first');
      return;
    }
    this.reportAPICall(this.reqTempLst[0].Chln, 'Y');
  }
  async ngOnInit() {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.GetSoftwareSetting();
    this.GetTempRequistion();
    this.GetCurrentMonthShopBudget();
  }
}
