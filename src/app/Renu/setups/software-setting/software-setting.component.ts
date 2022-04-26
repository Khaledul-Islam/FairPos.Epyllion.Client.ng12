import { Component, OnInit, ViewChild } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';
import { GlobalSetup } from '@app/models/GlobalSetup';

@Component({
  selector: 'app-software-setting',
  templateUrl: './software-setting.component.html',
  styleUrls: ['./software-setting.component.scss'],
})
export class SoftwareSettingComponent implements OnInit {
  public softwareSetting: GlobalSetup;
  public shopList = [];
  public ShopID: string | undefined;
  public UserID: string | undefined;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {
    this.softwareSetting = new GlobalSetup();
  }
  ShopListDDL() {
    this.http.get(this.env.apiUrl + 'api/ShopList').subscribe(
      (result) => {
        this.shopList = result as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  changeShop(shopid: any) {
    this.softwareSetting = new GlobalSetup();
    this.GetSoftwareSetting();
    this.ShopID = shopid;
    this.softwareSetting.StoreId = this.ShopID;
    console.log(this.ShopID);
    console.log(this.softwareSetting.StoreId);
  }
  async ngOnInit() {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.GetSoftwareSetting();
    this.ShopListDDL();
  }
  formatCurrentDate(date: any) {
    if (!date) return null;
    if (date.includes('T')) {
      let onlyDate = date.split('T');
      const [year, month, day] = onlyDate[0].split('-');
      //return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (date.includes('-')) {
      const [year, month, day] = date.split('-');
      //return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (date.includes(' ')) {
      let onlyDate = date.split(' ');
      const [month, day, year] = onlyDate[0].split('/');
      //return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      //return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else return date;
  }

  async GetSoftwareSetting() {
    let promise = this.http.get(this.env.apiUrl + 'api/ShopList/GetSoftwareSetting?storeID=' + this.ShopID).toPromise();
    return promise
      .then((resp) => {
        this.softwareSetting = resp as GlobalSetup;
        this.softwareSetting.BW_TODATE = this.formatCurrentDate(this.softwareSetting.BW_TODATE) as any;
        this.softwareSetting.BW_FROMDATE = this.formatCurrentDate(this.softwareSetting.BW_FROMDATE) as any;
        this.softwareSetting.NMS_FROMDATE = this.formatCurrentDate(this.softwareSetting.NMS_FROMDATE) as any;
        this.softwareSetting.NMS_TODATE = this.formatCurrentDate(this.softwareSetting.NMS_TODATE) as any;
        this.softwareSetting.REQ_FROMDATE = this.formatCurrentDate(this.softwareSetting.REQ_FROMDATE) as any;
        this.softwareSetting.REQ_TODATE = this.formatCurrentDate(this.softwareSetting.REQ_TODATE) as any;
        this.softwareSetting.ARR_FROMDATE = this.formatCurrentDate(this.softwareSetting.ARR_FROMDATE) as any;
        this.softwareSetting.ARR_TODATE = this.formatCurrentDate(this.softwareSetting.ARR_TODATE) as any;
        return this.softwareSetting;
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }

  async saveButtonClick() {
    if (this.softwareSetting.StoreId == null || this.softwareSetting.StoreId == undefined) {
      this.alertService.warning('Bad request');
      return;
    }
    if (this.softwareSetting == null || this.softwareSetting == undefined) {
      this.alertService.warning('Bad request');
      return;
    }
    let promise = this.http
      .post<GlobalSetup>(this.env.apiUrl + 'api/ShopList/SaveSoftwareSetting', this.softwareSetting)
      .toPromise();
    return promise.then((resp) => {
      this.alertService.success('Value Updated');
      this.softwareSetting = new GlobalSetup();
      this.GetSoftwareSetting();
      return resp;
    });
  }
}
