import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss'],
})
export class StockTransferComponent implements OnInit {
  public fromDate: Date | undefined;
  public toDate: Date | undefined;
  public tfrom: string | undefined;
  public tto: string | undefined;
  public summary: boolean | undefined;
  public tfromList = [
    {
      name: "Main Stock",
      value: "Main Stock"
    },
    {
      name: "Staff Stock",
      value: "Staff Stock"
    },
    {
      name: "Worker Stock",
      value: "Worker Stock"
    }
  ];
  public ttoList = [
    {
      name: "Main Stock",
      value: "Main Stock"
    },
    {
      name: "Staff Stock",
      value: "Staff Stock"
    },
    {
      name: "Worker Stock",
      value: "Worker Stock"
    }
  ];


  constructor(private http: HttpClient, private alertService: AlertService
    , private env: EnvService
    , private sanitizer: DomSanitizer
    , private credentinal: CredentialsService) {
  }

  fromchange(item: any) {
    this.ttoList = [
      {
        name: "Main Stock",
        value: "Main Stock"
      },
      {
        name: "Staff Stock",
        value: "Staff Stock"
      },
      {
        name: "Worker Stock",
        value: "Worker Stock"
      }
    ];
    this.ttoList = this.ttoList.filter(a => a.value != item);
  }
  tochange(item: any) {
    this.tfromList = [
      {
        name: "Main Stock",
        value: "Main Stock"
      },
      {
        name: "Staff Stock",
        value: "Staff Stock"
      },
      {
        name: "Worker Stock",
        value: "Worker Stock"
      }
    ];
    this.tfromList = this.tfromList.filter(a => a.value != item);
  }

  reportButtonClick() {
    if (this.summary == undefined) {
      this.alertService.warning("Please select report type")
      return
    }
    if (this.fromDate == null || this.fromDate == undefined) {
      this.alertService.warning("Please select from date")
      return
    }
    if (this.toDate == null || this.toDate == undefined) {
      this.alertService.warning("Please select to date")
      return
    }
    if ((this.tfrom == null || this.tfrom == undefined) && (this.tto == null || this.tto == undefined)) {
      this.tfrom = "ALL";
      this.tto = "ALL";
    }
    if (this.tfrom == null || this.tfrom == undefined) {
      this.tfrom = "ALL";
    }
    if (this.tto == null || this.tto == undefined) {
      this.tto = "ALL";
    }
    if (this.summary == true) {
      var url_ = this.env.reportUrl + 'Stock/StockTransferSummary?FromDate=' + this.fromDate + '&ToDate=' + this.toDate + '&fromStock=' + this.tfrom + '&toStock=' + this.tto + '&SecretKey=' + this.env.secrectKey;
      window.open(url_, '_blank')?.focus();
      this.calcelButtonClick();
    }
    if (this.summary == false) {
      var url_ = this.env.reportUrl + 'Stock/StockTransferDetails?FromDate=' + this.fromDate + '&ToDate=' + this.toDate + '&fromStock=' + this.tfrom + '&toStock=' + this.tto + '&SecretKey=' + this.env.secrectKey;
      window.open(url_, '_blank')?.focus();
      this.calcelButtonClick();
    }

  }

  calcelButtonClick() {
    this.ttoList = [];
    this.tfromList = [];
    this.tto = undefined;
    this.tfrom = undefined;
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
