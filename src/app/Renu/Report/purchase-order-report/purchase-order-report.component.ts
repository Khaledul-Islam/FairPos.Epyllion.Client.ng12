import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';

@Component({
  selector: 'app-purchase-order-report',
  templateUrl: './purchase-order-report.component.html',
  styleUrls: ['./purchase-order-report.component.scss'],
})
export class PurchaseOrderReportComponent implements OnInit {
  public fromDate: Date | undefined;
  public toDate: Date | undefined;
  public supID: string | undefined;
  public prdID: string | undefined;
  public itmID: string | undefined;
  public stockType: string | undefined;
  public ShopId: string | undefined;
  public summary: boolean | undefined;
  public stockList = [
    {
      name: "Regular PO",
      value: "Regular PO"
    },
    {
      name: "Cancel PO",
      value: "Cancel PO"
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
  prdChange() {
    if (this.supID == null || this.supID == undefined) {
      this.alertService.warning("Select supplier");
      return;
    }
    this.getItemList();
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
    if ((this.supID == null || this.supID == undefined) && (this.prdID == null || this.prdID == undefined) && (this.itmID == null || this.itmID == undefined) && (this.stockType == null || this.stockType == undefined)) {
      this.supID = "ALL"
      this.prdID = "ALL"
      this.itmID = "ALL"
      this.stockType = "All PO"
    }
    if(this.supID == null || this.supID == undefined){
      this.supID = "ALL"
    }
    if(this.prdID == null || this.prdID == undefined){
      this.prdID = "ALL"
    }
    if(this.itmID == null || this.itmID == undefined){
      this.itmID = "ALL"
    }
    if(this.stockType == null || this.stockType == undefined){
      this.stockType = "All PO"
    }
    if(this.ShopId == null || this.ShopId == undefined){
      this.ShopId = "ALL"
    }
    if (this.summary == true) {
      var url_ = this.env.reportUrl + 'PurchaseOrder/PurchaseOrderSummary?FromDate=' + 
      this.fromDate + '&Todate=' + this.toDate + '&ProductId=' + this.prdID + '&ItemId=' + 
      this.itmID + '&SupId=' + this.supID + '&CancelType=' + this.stockType + '&SecretKey=' + this.env.secrectKey;
      window.open(url_, '_blank')?.focus();
      this.calcelButtonClick();
    }
    if (this.summary == false) {
      var url_ = this.env.reportUrl + 'PurchaseOrder/PurchaseOrderDetails?FromDate=' + 
      this.fromDate + '&Todate=' + this.toDate + '&ProductId=' + this.prdID + '&ItemId=' + 
      this.itmID + '&SupId=' + this.supID + '&CancelType=' + this.stockType + '&SecretKey=' + this.env.secrectKey;
      window.open(url_, '_blank')?.focus();
      this.calcelButtonClick();
    }

  }

  calcelButtonClick() {
    this.supList = [];
    this.prdList = [];
    this.itmList = [];
    this.itmID = undefined;
    this.prdID = undefined;
    this.supID = undefined;
    this.fromDate = undefined;
    this.toDate = undefined;
    this.summary = undefined;
    this.stockType = undefined;
    this.getSupplierList()
    this.getProductList()
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
    this.ShopId = this.credentinal.credentials?.usersShop[0].ShopID;
    this.fromDate = this.formatCurrentDate(new Date()) as any;
    this.toDate = this.formatCurrentDate(new Date()) as any;
    this.getSupplierList()
    this.getProductList()
  }
}
