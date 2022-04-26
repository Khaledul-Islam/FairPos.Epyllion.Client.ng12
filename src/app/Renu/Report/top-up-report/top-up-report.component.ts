import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';

@Component({
  selector: 'app-top-up-report',
  templateUrl: './top-up-report.component.html',
  styleUrls: ['./top-up-report.component.scss'],
})
export class TopUpReportComponent implements OnInit {
  public fromDate: Date | undefined;
  public toDate: Date | undefined;
  public summary: boolean | undefined;
  public Rfid: string | undefined;

  constructor(private http: HttpClient, private alertService: AlertService
    , private env: EnvService
    , private sanitizer: DomSanitizer
    , private credentinal: CredentialsService) {
  }


  reportButtonClick() {
    if (this.summary == undefined) {
      this.alertService.warning("Please select report type")
      return
    }
    if (this.Rfid == null || this.Rfid == undefined) {
      this.Rfid = ''
    }
    if (this.fromDate == null || this.fromDate == undefined) {
      this.alertService.warning("Please select from date")
      return
    }
    if (this.toDate == null || this.toDate == undefined) {
      this.alertService.warning("Please select to date")
      return
    }

    if (this.summary == true) {
      var url_ = this.env.reportUrl + 'Topup/TopupSummary?FromDate=' + this.fromDate + '&Todate=' + this.toDate + '&Rfid=' + this.Rfid + '&SecretKey=' + this.env.secrectKey;
      window.open(url_, '_blank')?.focus();
      this.calcelButtonClick();
    }
    if (this.summary == false) {
      var url_ = this.env.reportUrl + 'Topup/TopupDetails?FromDate=' + this.fromDate + '&Todate=' + this.toDate + '&Rfid=' + this.Rfid + '&SecretKey=' + this.env.secrectKey;
      window.open(url_, '_blank')?.focus();
      this.calcelButtonClick();
    }

  }

  calcelButtonClick() {
    this.fromDate = undefined;
    this.toDate = undefined;
    this.summary = undefined;

  }
  IsSummary(item: any) {
    this.summary = item;
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

  ngOnInit() {
    this.fromDate = this.formatCurrentDate(new Date()) as any;
    this.toDate = this.formatCurrentDate(new Date()) as any;
  }


}

