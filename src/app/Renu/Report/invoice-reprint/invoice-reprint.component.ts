import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';
import { invoiceList } from '@app/models/StaffLedgercollectionList';

@Component({
  selector: 'app-invoice-reprint',
  templateUrl: './invoice-reprint.component.html',
  styleUrls: ['./invoice-reprint.component.scss'],
})
export class InvoiceReprintComponent implements OnInit {
  public fromDate: Date | undefined;
  public toDate: Date | undefined;
  public rfId: string | undefined;
  public name: string | undefined;
  public invoice: string | undefined;
  public invoiceList: invoiceList[];

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private sanitizer: DomSanitizer,
    private credentinal: CredentialsService
  ) {
    this.invoiceList = [];
  }
  getEmpName() {
    let promise = this.http.get('Report/getEmpName?Invoice=' + this.invoice, { responseType: 'text' }).toPromise();
    return promise.then(resp => {
      this.name = resp;
      return resp;
    })
  }
  reportButtonClick() {
    if (this.name == null || this.name == undefined) {
      this.alertService.warning('No employee selected');
      return;
    }
    var url_ = this.env.reportUrl +'Sale/SalesInvoice?InvoiceNo='+this.invoice+'&Reprint=Reprint&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
    this.calcelButtonClick();
  }
  async nextButtonClick() {
    if (this.fromDate == null || this.fromDate == undefined) {
      this.alertService.warning('Please Input FROM Date');
      return;
    }
    if (this.toDate == null || this.toDate == undefined) {
      this.alertService.warning('Please Input TO Date');
      return;
    }
    if (this.rfId == null || this.rfId == undefined) {
      this.rfId = ''
    }
    let promise = this.http
      .get('Report/GetInvoiceNoSSummary?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&rfID=' + this.rfId)
      .toPromise();
    return promise
      .then((resp) => {
        console.log(resp);
        this.invoiceList = resp as invoiceList[];
        this.name = this.invoiceList[0].Name;
        this.invoice = this.invoiceList[0].Invoice;
        return this.invoiceList;
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }

  calcelButtonClick() {
    this.invoiceList = [];
    this.fromDate = undefined;
    this.toDate = undefined;
    this.rfId = undefined;
    this.name = undefined;
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
