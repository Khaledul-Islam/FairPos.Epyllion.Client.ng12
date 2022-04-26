import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss'],
})
export class StockReportComponent implements OnInit {
  public fromDate: Date | undefined;
  public toDate: Date | undefined;
  public supID: string | undefined;
  public prdID: string | undefined;
  public itmID: string | undefined;
  public conditions: string | undefined;
  public stockType: string | undefined;
  public ShopId: string | undefined;
  public summary: string | undefined;
  public stockList = [
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
  public supList = [];
  public prdList = [];
  public itmList = [];


  constructor(private http: HttpClient, private alertService: AlertService
    , private env: EnvService
    , private sanitizer: DomSanitizer
    , private credentinal: CredentialsService) {
  }

  async getSupplierList() {
    let promise = this.http.get(this.env.apiUrl + 'api/Supplier').toPromise();
    return promise.then(resp => {
      return this.supList = resp as any
    })
  }
  async getProductList() {
    let promise = this.http.get(this.env.apiUrl + 'api/Product').toPromise();
    return promise.then(resp => {
      return this.prdList = resp as any
    })
  }
  async getItemList() {
    let promise = this.http.get(this.env.apiUrl + 'Report/getItemList?supid=' + this.supID + '&prdId=' + this.prdID).toPromise();
    return promise.then(resp => {
      return this.itmList = resp as any
    })
  }
  radioCheck(item: any) {
    this.conditions = item;
    console.log(this.conditions);

  }
  prdChange() {
    if (this.supID == null || this.supID == undefined) {
      this.alertService.warning("Select supplier");
      return;
    }
    this.getItemList();
  }
  reportButtonClick() {
    debugger
    if (this.summary == undefined) {
      this.alertService.warning("Please select report type")
      return
    }
    if (this.conditions == undefined) {
      this.alertService.warning("Please select condition type")
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
    if ((this.supID == null || this.supID == undefined) && (this.prdID == null || this.prdID == undefined) && (this.itmID == null || this.itmID == undefined) && (this.stockType == null || this.stockType == undefined)) {
      this.supID = "ALL"
      this.prdID = "ALL"
      this.itmID = "ALL"
      this.stockType = "ALL"
    }
    if (this.supID == null || this.supID == undefined) {
      this.supID = "ALL"
    }
    if (this.prdID == null || this.prdID == undefined) {
      this.prdID = "ALL"
    }
    if (this.itmID == null || this.itmID == undefined) {
      this.itmID = "ALL"
    }
    if (this.stockType == null || this.stockType == undefined) {
      this.stockType = "ALL"
    }
    if (this.summary == "rbPeriodicalStockReport") {
      if (this.stockType == "ALL") {
        this.alertService.warning("Please select Stock Type")
        return
      }
      else if (this.stockType == "Main Stock") {
        var url_ = this.env.reportUrl + 'Stock/StockPeriodical?FromDate=' +
          this.fromDate + '&Todate=' + this.toDate + '&ShopId=' + this.ShopId + '&ProductId=' +
          this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&Condition=' + this.conditions + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick()
      }
      else if (this.stockType == "Staff Stock") {
        var url_ = this.env.reportUrl + 'Stock/StockPeriodicalStaff?FromDate=' +
          this.fromDate + '&Todate=' + this.toDate + '&ShopId=' + this.ShopId + '&ProductId=' +
          this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&Condition=' + this.conditions + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick()
      }
      else if (this.stockType == "Worker Stock") {
        var url_ = this.env.reportUrl + 'Stock/StockPeriodicalWorker?FromDate=' +
          this.fromDate + '&Todate=' + this.toDate + '&ShopId=' + this.ShopId + '&ProductId=' +
          this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&Condition=' + this.conditions + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick()
      }
    }
    else if (this.summary == "rbStockReportCurrent") {
      if (this.stockType == "ALL") {
        this.alertService.warning("Please select Stock Type")
        return
      }
      else if (this.stockType == "Main Stock") {
        var url_ = this.env.reportUrl + 'Stock/StockItemWise?FromDate=' +
          this.fromDate + '&Todate=' + this.toDate + '&ShopId=' + this.ShopId + '&ProductId=' +
          this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&Condition=' + this.conditions + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick()
      }
      else if (this.stockType == "Staff Stock") {
        var url_ = this.env.reportUrl + 'Stock/StockItemWiseReportStaff?FromDate=' +
          this.fromDate + '&Todate=' + this.toDate + '&ShopId=' + this.ShopId + '&ProductId=' +
          this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&Condition=' + this.conditions + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick()
      }
      else if (this.stockType == "Worker Stock") {
        var url_ = this.env.reportUrl + 'Stock/StockItemWiseReportWorker?FromDate=' +
          this.fromDate + '&Todate=' + this.toDate + '&ShopId=' + this.ShopId + '&ProductId=' +
          this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&Condition=' + this.conditions + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick()
      }

    }
    else if (this.summary == "rbProductWiseStock") {
      var url_ = this.env.reportUrl + 'Stock/StockProductWise?FromDate=' +
        this.fromDate + '&Todate=' + this.toDate + '&ShopId=' + this.ShopId + '&ProductId=' +
        this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&Condition=' +
        this.conditions + '&StockType=' + this.stockType + '&SecretKey=' + this.env.secrectKey;
      window.open(url_, '_blank')?.focus();
      this.calcelButtonClick()
    }
    else if (this.summary == "rbSupplierWise") {
      var url_ = this.env.reportUrl + 'Stock/StockSupplierWise?FromDate=' +
        this.fromDate + '&Todate=' + this.toDate + '&ShopId=' + this.ShopId + '&ProductId=' +
        this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&Condition=' + this.conditions + '&StockType=' + this.stockType + '&SecretKey=' + this.env.secrectKey;
      window.open(url_, '_blank')?.focus();
      this.calcelButtonClick()
    }
    else if (this.summary == "rbDamageStockReportCurrent") {
      var url_ = this.env.reportUrl + 'Stock/DamageStock?FromDate=' +
        this.fromDate + '&Todate=' + this.toDate + '&ShopId=' + this.ShopId + '&ProductId=' +
        this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&Condition=' + this.conditions + '&SecretKey=' + this.env.secrectKey;
      window.open(url_, '_blank')?.focus();
      this.calcelButtonClick()
    }
    else if (this.summary == "rdbPeriodical2") {
      if (this.stockType == "ALL") {
        this.alertService.warning("Please select Stock Type")
        return
      }
      else if (this.stockType == "Main Stock") {
        var url_ = this.env.reportUrl + 'Stock/StockPeriodical2?FromDate=' +
          this.fromDate + '&Todate=' + this.toDate + '&ShopId=' + this.ShopId + '&ProductId=' +
          this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&Condition=' + this.conditions + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick()
      }
      else if (this.stockType == "Staff Stock") {
        var url_ = this.env.reportUrl + 'Stock/StockPeriodical2Staff?FromDate=' +
          this.fromDate + '&Todate=' + this.toDate + '&ShopId=' + this.ShopId + '&ProductId=' +
          this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&Condition=' + this.conditions + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick()
      }
      else if (this.stockType == "Worker Stock") {
        var url_ = this.env.reportUrl + 'Stock/StockPeriodical2WS?FromDate=' +
          this.fromDate + '&Todate=' + this.toDate + '&ShopId=' + this.ShopId + '&ProductId=' +
          this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&Condition=' + this.conditions + '&SecretKey=' + this.env.secrectKey;
        window.open(url_, '_blank')?.focus();
        this.calcelButtonClick()
      }
    }

  }

  calcelButtonClick() {
    this.supList = [];
    this.prdList = [];
    this.itmList = [];
    this.itmID = undefined;
    this.prdID = undefined;
    this.supID = undefined;
   // this.fromDate = undefined;
   // this.toDate = undefined;
   // this.summary = undefined;
    this.stockType = undefined;
    //this.conditions = undefined;
    this.getSupplierList()
    this.getProductList()
  }
  IsSummary(item: any) {
    this.summary = item;
    console.log(this.summary);

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
    this.ShopId = this.credentinal.credentials?.usersShop[0].ShopID;
    this.fromDate = this.formatCurrentDate(new Date()) as any;
    this.toDate = this.formatCurrentDate(new Date()) as any;
    this.getSupplierList()
    this.getProductList()
  }
}
