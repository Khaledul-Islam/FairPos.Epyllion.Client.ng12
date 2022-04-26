import { Component, OnInit, ViewChild } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';
import { TempArrivalUpdate } from '@app/models/TempArrivalUpdate';
@Component({
  selector: 'app-arrival-update',
  templateUrl: './arrival-update.component.html',
  styleUrls: ['./arrival-update.component.scss'],
})
export class ArrivalUpdateComponent implements OnInit {
  public SupplierList = [];
  public arrivalDDL = [];
  public tmpArrivalUp: TempArrivalUpdate;
  public tmpArrivalUpList: TempArrivalUpdate[];
  public UserID: string | undefined;
  public ShopID: string | undefined;

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
    this.tmpArrivalUp = new TempArrivalUpdate();
    this.tmpArrivalUpList = [];
  }

  async updateTmpArrival(item: TempArrivalUpdate) {
    this.alertService.confirm2(
      'Are you sure to modify the data',
      () => {
        const promise = this.http
          .post<TempArrivalUpdate>(this.env.apiUrl + 'ArrivalEdit/updateTmpArrival', item)
          .toPromise();
        return promise
          .then((resp) => {
            this.alertService.success('Data updated');
            this.GetTempArrivalUpdateList();
            return resp;
          })
          .catch((error) => {
            this.alertService.error(error.error);
          });
      },
      () => {
        this.GetTempArrivalUpdateList();
      }
    );
  }
  cancelButtonClick() {}
  async reportAPICall(arrivalno: string, header: string) {
    var url_ =
      this.env.reportUrl + 'Arrival/ArrivalChallanWise?ARRIVAL_NO=' + arrivalno + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  async saveButtonClick() {
    if (this.tmpArrivalUp.RefNo == null || this.tmpArrivalUp.RefNo == undefined) {
      this.alertService.warning('Enter Refference Number');
      return;
    }
    this.alertService.confirm2(
      'Are you sure to save the data',
      () => {
        this.tmpArrivalUp.UserID = this.UserID;
        const promise = this.http
          .post(this.env.apiUrl + 'ArrivalEdit/updateArrival', this.tmpArrivalUp, { responseType: 'text' })
          .toPromise();
        return promise
          .then((resp) => {
            this.alertService.success('Data updated successfully');
            this.tmpArrivalUp = new TempArrivalUpdate();
            this.tmpArrivalUp.BuyDT = this.formatCurrentDate(new Date()) as any;
            this.tmpArrivalUp.RefDate = this.formatCurrentDate(new Date()) as any;
            this.GrantTotal = 0;
            this.GrantQuantity = 0;
            this.ItemQuantity = 0;
            this.GetTempArrivalUpdateList();
            this.reportAPICall(resp, 'Arrival Edit Copy');
            return resp;
          })
          .catch((error) => {
            this.alertService.error(error.error);
          });
      },
      () => {
        this.GetTempArrivalUpdateList();
      }
    );
  }
  async updateTmpArrival2(item: TempArrivalUpdate) {
    this.alertService.confirm2(
      'Are you sure to modify the data',
      () => {
        item.ArrivalQty = Number(item.BoxQty) * Number(item.BoxSize);
        const promise = this.http
          .post<TempArrivalUpdate>(this.env.apiUrl + 'ArrivalEdit/updateTmpArrival', item)
          .toPromise();
        return promise
          .then((resp) => {
            this.alertService.success('Data updated');
            this.GetTempArrivalUpdateList();
            return resp;
          })
          .catch((error) => {
            this.alertService.error(error.error);
          });
      },
      () => {
        this.GetTempArrivalUpdateList();
      }
    );
  }
  async updateTmpArrival3(item: TempArrivalUpdate) {
    this.alertService.confirm2(
      'Are you sure to modify the data',
      () => {
        item.BoxQty = Number(item.ArrivalQty) / Number(item.BoxSize);
        const promise = this.http
          .post<TempArrivalUpdate>(this.env.apiUrl + 'ArrivalEdit/updateTmpArrival', item)
          .toPromise();
        return promise
          .then((resp) => {
            this.alertService.success('Data updated');
            this.GetTempArrivalUpdateList();
            return resp;
          })
          .catch((error) => {
            this.alertService.error(error.error);
          });
      },
      () => {
        this.GetTempArrivalUpdateList();
      }
    );
  }
  async GetTempArrivalUpdateList() {
    const promise = this.http
      .get(this.env.apiUrl + 'ArrivalEdit/GetTempArrivalUpdateByUser?UserID=' + this.UserID)
      .toPromise();
    return promise.then(
      (response) => {
        this.tmpArrivalUpList = response as TempArrivalUpdate[];
        this.tmpArrivalUp.SupID = this.tmpArrivalUpList[0].SupID;
        this.tmpArrivalUp.ARRIVAL_NO = this.tmpArrivalUpList[0].ARRIVAL_NO;
        this.tmpArrivalUp.RefNo = this.tmpArrivalUpList[0].RefNo;
        this.tmpArrivalUp.RefDate = this.formatCurrentDate2(this.tmpArrivalUpList[0].RefDate) as any;
        this.tmpArrivalUp.BuyDT = this.formatCurrentDate2(this.tmpArrivalUpList[0].BuyDT) as any;
        this.GrantTotal = 0;
        this.ItemQuantity = 0;
        this.tmpArrivalUpList.forEach((element) => {
          let sum = Number(element.RPU) * Number(element.ArrivalQty);
          this.GrantTotal = Number(this.GrantTotal) + sum;
          this.ItemQuantity = Number(this.ItemQuantity) + Number(element.ArrivalQty);
        });
        this.GrantQuantity = this.tmpArrivalUpList.length;
        return this.tmpArrivalUpList;
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }

  async supplierDDL() {
    const promise = this.http.get(this.env.apiUrl + 'api/Supplier').toPromise();
    return promise.then(
      (response: any) => {
        return (this.SupplierList = response);
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }

  async GetArrivalNoQCDDL() {
    const promise = this.http
      .get(this.env.apiUrl + 'ArrivalEdit/GetArrivalNoQC?UserID=' + this.UserID + '&ShopID=' + this.ShopID)
      .toPromise();
    return promise.then(
      (response: any) => {
        return (this.arrivalDDL = response);
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }

  async LoadProduct() {
    if (this.tmpArrivalUp.ARRIVAL_NO === undefined || this.tmpArrivalUp.ARRIVAL_NO === null) {
      this.alertService.warning('Select Arrival Number.');
      return;
    }
    let promise = this.http
      .get(
        this.env.apiUrl +
          'ArrivalEdit/LoadTempArrivalUpdate?arrivalNo=' +
          this.tmpArrivalUp.ARRIVAL_NO +
          '&UserID=' +
          this.UserID
      )
      .toPromise();
    return promise
      .then((resp) => {
        this.GetTempArrivalUpdateList();
        return resp;
      })
      .catch((error) => {
        this.alertService.error(error.error);
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

  async clearButtonClick() {
    this.tmpArrivalUp.UserID = this.UserID;
    const promise = this.http.post(this.env.apiUrl + 'ArrivalEdit/deleteTmpArrival', this.tmpArrivalUp).toPromise();
    return promise
      .then((resp) => {
        this.tmpArrivalUp = new TempArrivalUpdate();
        this.tmpArrivalUp.BuyDT = this.formatCurrentDate(new Date()) as any;
        this.tmpArrivalUp.RefDate = this.formatCurrentDate(new Date()) as any;
        this.GrantTotal = 0;
        this.GrantQuantity = 0;
        this.ItemQuantity = 0;
        this.GetTempArrivalUpdateList();
        return resp;
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }

  ngOnInit() {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.tmpArrivalUp.BuyDT = this.formatCurrentDate(new Date()) as any;
    this.tmpArrivalUp.RefDate = this.formatCurrentDate(new Date()) as any;
    this.supplierDDL();
    this.GetArrivalNoQCDDL();
    this.GetTempArrivalUpdateList();
  }
}
