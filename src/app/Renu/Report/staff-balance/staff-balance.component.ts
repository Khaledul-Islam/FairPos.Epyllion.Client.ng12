import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';

@Component({
  selector: 'app-staff-balance',
  templateUrl: './staff-balance.component.html',
  styleUrls: ['./staff-balance.component.scss'],
})
export class StaffBalanceComponent implements OnInit {
  public fromDate: Date | undefined;
  public toDate: Date | undefined;
  public today: Date | undefined;
  public summary: boolean | undefined;
  public isUpdate: boolean | undefined;
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
      if (this.isUpdate == true) {
        var url_ = this.env.reportUrl + 'Topup/MemberBalanceDetails?FromDate=01/01/1900&Todate=' + this.today + '&Rfid=' + this.Rfid + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick();
      }
      else {
        var url_ = this.env.reportUrl + 'Topup/MemberBalanceDetails?FromDate=' + this.fromDate + '&Todate=' + this.toDate + '&Rfid=' + this.Rfid + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick();
      }
    }
    else if (this.summary == false) {
      if (this.isUpdate == true) {
        var url_ = this.env.reportUrl + 'Topup/MemberBalanceDetails?FromDate=01/01/1900&Todate=' + this.today + '&Rfid=' + this.Rfid + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick();
      }
      else {
        var url_ = this.env.reportUrl + 'Topup/MemberBalanceDetails?FromDate=' + this.fromDate + '&Todate=' + this.toDate + '&Rfid=' + this.Rfid + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick();
      }
    }
  }

  calcelButtonClick() {
    this.fromDate = undefined;
    this.toDate = undefined;
    this.summary = undefined;
    this.isUpdate = undefined;

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
    this.today = this.formatCurrentDate(new Date()) as any;
    this.fromDate = this.formatCurrentDate(new Date()) as any;
    this.toDate = this.formatCurrentDate(new Date()) as any;
  }

}

