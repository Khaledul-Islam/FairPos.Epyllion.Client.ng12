import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';
import { Subject } from 'rxjs';
import { QualityControl } from '@app/models/QualityControl';
import { TempArrivalUpdate } from '@app/models/TempArrivalUpdate';

@Component({
  selector: 'app-quality-control',
  templateUrl: './quality-control.component.html',
  styleUrls: ['./quality-control.component.scss'],
})
export class QualityControlComponent implements OnInit {
  public SupplierList = [];
  public PendingPOList = [];
  public ChallanItemsList = [];
  public ChallanDetails: TempArrivalUpdate[];

  public UserID: string | undefined;
  public ShopID: string | undefined;
  public QualityControl: QualityControl;
  public QualityControlList: QualityControl[];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public GrantTotal = 0;
  public GrantQuantity = 0;
  public ItemQuantity = 0;
  public userName = '';
  public OrderDate = new Date();

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {
    this.QualityControl = new QualityControl();
    this.QualityControlList = [];
    this.ChallanDetails = [];
  }

  async supplierDDL() {
    const promise = this.http
      .get(this.env.apiUrl + 'QualityControl/QCSupplierDDL?ShopID=' + this.ShopID + '&UserID=' + this.UserID)
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
  async GetPendingPONo(SupID: any) {
    const promise = this.http
      .get(
        this.env.apiUrl +
          'QualityControl/GetPendingPONo?supplierId=' +
          SupID +
          '&ShopID=' +
          this.ShopID +
          '&UserID=' +
          this.UserID
      )
      .toPromise();
    return promise.then(
      (response: any) => {
        return (this.PendingPOList = response);
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }
  async GetChallanItems(dcno: any) {
    const promise = this.http.get(this.env.apiUrl + 'QualityControl/GetChallanItems?dcno=' + dcno).toPromise();
    return promise.then(
      (response: any) => {
        return (this.ChallanItemsList = response);
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }
  async LoadButtonClick() {
    if (
      this.QualityControl.SupID === null ||
      this.QualityControl.SupID === undefined ||
      this.QualityControl.Chln === null ||
      this.QualityControl.Chln === undefined
    ) {
      this.alertService.warning('Please fillup Supplier and Arrival Information');
      return;
    } else {
      await this.GetChallanDetails();
      await this.SaveTempArrival();
      await this.GetTempQualityControl();
    }
  }
  async GetChallanDetails() {
    const promise = this.http
      .get(
        this.env.apiUrl +
          'QualityControl/GetChallanDetails?dcno=' +
          this.QualityControl.Chln +
          '&sBarcode=' +
          this.QualityControl.sBarCode
      )
      .toPromise();
    return promise.then(
      (response) => {
        return (this.ChallanDetails = response as TempArrivalUpdate[]);
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }
  async GetTempQualityControl() {
    const promise = this.http
      .get(this.env.apiUrl + 'QualityControl/GetTempQualityControl?UserID=' + this.UserID + '&ShopID=' + this.ShopID)
      .toPromise();
    return promise.then(
      (response: any) => {
        this.QualityControlList = response;
        this.QualityControlList.forEach((element) => {
          this.ItemQuantity = this.QualityControlList.length;
          this.GrantQuantity = element.QCBoxQty as any;
          this.GrantTotal = Number(element.RPU) * Number(element.QCBoxQty);
        });
        if (this.QualityControlList.length > 0) {
          this.QualityControl.SupID = this.QualityControlList[0].SupID;
          this.QualityControl.Chln = this.QualityControlList[0].ARRIVAL_NO;
          this.QualityControl.sBarCode = this.QualityControlList[0].sBarCode;
          this.GetChallanItems(this.QualityControl.Chln);
        }
        return (this.QualityControlList = response);
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }
  validate() {
    if (this.QualityControl.SupID === null || this.QualityControl.SupID === undefined) {
      this.alertService.warning('Supplier is Required');
      return;
    }
  }
  validaten() {
    if (this.QualityControl.Chln === null || this.QualityControl.Chln === undefined) {
      this.alertService.warning('Arrival Number is Required');
      return;
    }
  }
  async SaveTempArrival() {
    this.ChallanDetails.forEach((element) => {
      element.UserID = this.UserID;
      element.ShopID = this.ShopID;
    });

    const promise = this.http.post(this.env.apiUrl + 'QualityControl/SaveTempArrival', this.ChallanDetails).toPromise();
    return promise.then(
      (response: any) => {
        return response;
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }
  ngOnInit() {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.supplierDDL();
    this.GetTempQualityControl();
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  async reportAPICall(id_no: string, header: string) {
    var url_ =
      this.env.reportUrl +
      'QC/QualityControlByQC_NO?QC_NO=' +
      id_no +
      '&ReportType=' +
      header +
      '&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  async saveButtonClick() {
    if (this.QualityControlList.length == 0) {
      this.alertService.warning('No data available to save');
      return;
    }
    this.alertService.confirm('are you sure you want to save this data', () => {
      this.QualityControlList.forEach((element) => {
        element.totalPrice = this.GrantTotal;
        element.ShopID = this.ShopID;
      });
      let promise = this.http
        .post(this.env.apiUrl + 'QualityControl/SaveQualityControl', this.QualityControlList)
        .toPromise();
      return promise
        .then(async (response) => {
          this.alertService.success('Saved successful');
          this.QualityControl = new QualityControl();
          this.QualityControlList = [];
          this.ChallanItemsList = [];
          this.PendingPOList = [];
          this.GrantTotal = 0;
          this.GrantQuantity = 0;
          this.ItemQuantity = 0;
          console.log(response);
          debugger;
          if (response[0] != null || response[0] != '') {
            this.reportAPICall(response[0], 'Accounts Copy');
            this.reportAPICall(response[0], 'Supply Chain Copy');
            this.reportAPICall(response[0], 'Audit Copy');
          }
          if (response[1] != null && response[1] != '') {
            this.reportAPICallDeliveryChallan(response[1], "Supplier's Copy");
            this.reportAPICallDeliveryChallan(response[1], 'Book Copy');
            this.reportAPICallDeliveryChallan(response[1], 'MCD Copy');
          }
          if (response[2] != null && response[2] != '') {
            this.reportAPICallDebidNote(response[2], '-');
          }
          this.GetTempQualityControl();
          return response;
        })
        .catch((error) => {
          this.alertService.error(error.error);
        });
    });
  }
  async reportAPICallDeliveryChallan(id_no: string, header: string) {
    var url_ =
      this.env.reportUrl +
      'Delivery/QualityControlByQC_NO?DeliveryChlnNo=' +
      id_no +
      '&ReportType=' +
      header +
      '&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
    //document.write('<meta http-equiv="refresh" content="5;url='+url_+'">');
  }
  async reportAPICallDebidNote(id_no: string, header: string) {
    var url_ =
      this.env.reportUrl +
      'Delivery/DeliveryNoteByDebitNoteNo?DebitNoteNo=' +
      id_no +
      '&ReportType=' +
      header +
      '&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  async clearButtonClick() {
    this.alertService.confirm('Are you sure to clear the data', () => {
      let promise = this.http.delete(this.env.apiUrl + 'QualityControl/DeleteTempQC?UserID=' + this.UserID).toPromise();
      return promise
        .then(async (response) => {
          this.QualityControl = new QualityControl();
          this.QualityControlList = [];
          this.ChallanItemsList = [];
          this.PendingPOList = [];
          this.GrantTotal = 0;
          this.GrantQuantity = 0;
          this.ItemQuantity = 0;
          this.GetTempQualityControl();
          return response;
        })
        .catch((error) => {
          this.alertService.error(error.error);
        });
    });
  }
  async cancelButtonClick() {
    this.QualityControl = new QualityControl();
    this.QualityControlList = [];
    this.ChallanItemsList = [];
    this.PendingPOList = [];
    this.GrantTotal = 0;
    this.GrantQuantity = 0;
    this.ItemQuantity = 0;
    this.GetTempQualityControl();
  }
}
