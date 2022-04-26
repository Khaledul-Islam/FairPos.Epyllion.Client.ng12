import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';
import { collectionList } from '@app/models/StaffLedgercollectionList';

@Component({
  selector: 'app-sales-order-reprint',
  templateUrl: './sales-order-reprint.component.html',
  styleUrls: ['./sales-order-reprint.component.scss'],
})
export class SalesOrderReprintComponent implements OnInit {
  public fromDate: Date | undefined;
  public toDate: Date | undefined;
  public rfId: string | undefined;
  public invoice: string | undefined;
  public collectionList: collectionList[];

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private sanitizer: DomSanitizer,
    private credentinal: CredentialsService
  ) {
    this.collectionList = [];
  }

  reportButtonClick() {
    if (this.invoice == null || this.invoice == undefined) {
      this.alertService.warning('No invoice found');
      return;
    }
    var url_ =
      this.env.reportUrl +
      'Sale/SOChallan?UserId=' +
      this.invoice +
      '&ReportType=Reprint&IsTemp=false&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  async nextButtonClick() {
    if (this.rfId == null || this.rfId == undefined) {
      this.rfId = '';
    }
    let promise = this.http
      .get('Report/GetPendingPrintedItems?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&rfID=' + this.rfId)
      .toPromise();
    return promise
      .then((resp) => {
        this.collectionList = resp as any;
        this.invoice = this.collectionList[0] as any;
        return this.collectionList;
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }

  calcelButtonClick() {
    this.collectionList = [];
    this.fromDate = undefined;
    this.toDate = undefined;
    this.rfId = undefined;
    this.invoice = undefined;
  }
  formatCurrentDate(date: any) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    var today = year + '-' + month + '-' + day;
    return today;
  }
  formatDBDate(date: any) {
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

  ngOnInit(): void {
    this.fromDate = this.formatCurrentDate(new Date()) as any;
    this.toDate = this.formatCurrentDate(new Date()) as any;
  }
}
