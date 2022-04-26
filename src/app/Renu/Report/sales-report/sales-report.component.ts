import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit {
  public fromDate: Date | undefined;
  public toDate: Date | undefined;
  public supID: string | undefined;
  public prdID: string | undefined;
  public itmID: string | undefined;
  public stockType: string | undefined;
  public ShopId: string | undefined;
  public UserID: string | undefined;
  public EmpID: string | undefined;
  public txtSStockReport: string | undefined;
  public EmpType: string | undefined;
  public EmpTypeOnOFF = false;
  public EmpIDOnOFF = false;
  public salesStockOnOff = false;
  public all = true;
  public rpu = true;
  public summary: string | undefined;
  public stockList = [
    {
      name: "ALL",
      value: "ALL"
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
  public EmpTypeList = [
    {
      name: "ALL",
      value: "ALL"
    },
    {
      name: "Management Staff",
      value: "Management Staff"
    },
    {
      name: "Non Management Staff",
      value: "Non Management Staff"
    },
    {
      name: "Worker",
      value: "Worker"
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
  OpenSalesDaily(monthFromDate: any, monthToDate: any, yearFromDate: any, YearToDate: any) {
    var url_ = this.env.reportUrl + 'Sale/DailySales?MonthFromDate=' + monthFromDate + '&MonthToDate=' + monthToDate + '&YearFromDate=' + yearFromDate + '&YearToDate=' + YearToDate + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesShopSupItem(FromDate: any, ToDate: any, shopId: any, PrdId: string, sbarocde: string, supId: string, fromStock: string) {
    var url_ = this.env.reportUrl + 'Sale/ShopItemWiseSales?FromDate=' + FromDate + '&Todate=' +
      ToDate + '&ShopId=' + shopId + '&ProductId=' + PrdId + '&ItemID=' + sbarocde + '&SupId=' + supId + '&FromStock=' + fromStock + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesItemWise(FromDate: any, ToDate: any, shopId: any, PrdId: string, sbarocde: string, supId: string, fromStock: string) {
    var url_ = this.env.reportUrl + 'Sale/ItemWiseSales?FromDate=' + FromDate + '&Todate=' +
      ToDate + '&ShopId=' + shopId + '&ProductId=' + PrdId + '&ItemID=' + sbarocde + '&SupId=' + supId + '&FromStock=' + fromStock + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesStockReport(FromDate: any, ToDate: any, shopId: any, PrdId: string, itemId: string, supId: string, take: string, sortOrder: string, fromStock: string) {
    var url_ = this.env.reportUrl + 'Sale/SalesStockReport?FromDate=' + FromDate + '&Todate=' + ToDate + '&ShopId=' + shopId +
      '&ProductId=' + PrdId + '&ItemID=' + itemId + '&SupId=' + supId + '&Take=' + take + '&SortOrder=' + sortOrder + '&FromStock=' + fromStock + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesFromStockPercent(FromDate: any, ToDate: any, shopId: any, itemid: string, PrdId: string, supId: string, fromStock: string) {
    var url_ = this.env.reportUrl + 'Sale/SalesFromStockPercent?FromDate=' + FromDate + '&Todate=' + ToDate + '&ShopId=' + shopId +
      '&ProductId=' + PrdId + '&ItemID=' + itemid + '&SupId=' + supId + '&FromStock=' + fromStock + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesSupplierGP(FromDate: any, ToDate: any, shopId: any, itemid: string, PrdId: string, supId: string, fromStock: string) {
    var url_ = this.env.reportUrl + 'Sale/SupplierWIseGP?FromDate=' + FromDate + '&Todate=' + ToDate + '&ShopId=' + shopId +
      '&ProductId=' + PrdId + '&ItemID=' + itemid + '&SupId=' + supId + '&FromStock=' + fromStock + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesSupplierSalesPercent(FromDate: any, ToDate: any, shopId: any, itemid: string, PrdId: string, supId: string, fromStock: string) {
    var url_ = this.env.reportUrl + 'Sale/SupplierSalesContribution?FromDate=' + FromDate + '&Todate=' + ToDate + '&ShopId=' + shopId +
      '&ProductId=' + PrdId + '&ItemID=' + itemid + '&SupId=' + supId + '&FromStock=' + fromStock + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesInvoiceWiseSalesSummary(FromDate: any, ToDate: any, shopId: any, itemid: string, PrdId: string, supId: string, fromStock: string) {
    var url_ = this.env.reportUrl + 'Sale/SalesInvoiceWiseSummary?FromDate=' + FromDate + '&Todate=' + ToDate + '&ShopId=' + shopId +
      '&ProductId=' + PrdId + '&ItemID=' + itemid + '&SupId=' + supId + '&FromStock=' + fromStock + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesInvoiceWiseSalesDetails(FromDate: any, ToDate: any, shopId: any, PrdId: string, itemId: string, supId: string, empId: any, fromStock: string) {
    var url_ = this.env.reportUrl + 'Sale/SalesInvoiceWiseDetails?FromDate=' + FromDate + '&Todate=' + ToDate + '&ShopId=' + shopId +
      '&ProductId=' + PrdId + '&Sbarcode=' + itemId + '&SupId=' + supId + '&EmpId=' + empId + '&FromStock=' + fromStock + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesGroupWise(FromDate: any, ToDate: any, shopId: any, itemid: string, PrdId: string, supId: string, fromStock: string) {
    var url_ = this.env.reportUrl + 'Sale/GroupWiseSales?FromDate=' + FromDate + '&Todate=' +
      ToDate + '&ShopId=' + shopId + '&ProductId=' + PrdId + '&ItemID=' + itemid + '&SupId=' + supId + '&FromStock=' + fromStock + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesCashierWiseSummary(FromDate: any, ToDate: any, shopId: any, BTID: string, groupId: string, PrdId: string, supId: string, fromStock: string) {
    var url_ = this.env.reportUrl + 'Sale/SalesCasierSummary?FromDate=' + FromDate + '&Todate=' + ToDate + '&ShopId=' + shopId +
      '&BTID=' + BTID + '&GroupID=' + groupId + '&ProductId=' + PrdId + '&SupId=' + supId + '&FromStock=' + fromStock + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesSlowMovingItems(FromDate: any, ToDate: any, shopId: any, itemid: string, PrdId: string, supId: string, fromStock: string) {
    var url_ = this.env.reportUrl + 'Sale/SalesSlowMovingItems?FromDate=' + FromDate + '&Todate=' + ToDate + '&ShopId=' + shopId +
      '&ProductId=' + PrdId + '&ItemID=' + itemid + '&SupId=' + supId + '&FromStock=' + fromStock + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesBasketReport(FromDate: any, ToDate: any, shopId: any, itemid: string, PrdId: string, supId: string, fromStock: string) {
    var url_ = this.env.reportUrl + 'Sale/SalesBasket?FromDate=' + FromDate + '&Todate=' + ToDate + '&ShopId=' + shopId +
      '&ProductId=' + PrdId + '&ItemID=' + itemid + '&SupId=' + supId + '&FromStock=' + fromStock + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  SalesExpenseReport(fromDate: any, toDate: any, shopId: any, userId: any) {
    var url_ = this.env.reportUrl + '' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  OpenSalesEmpExcel(FromDate: any, ToDate: any, shopId: any, itemid: string, PrdId: string, supId: string, fromStock: string, empid: any) {
    var url_ = this.env.reportUrl + '' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  reportButtonClick() {
    debugger
    var date = new Date();
    var monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    var monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var YearStart = new Date(date.getFullYear(), 0, 1);
    var YearEnd = new Date(date.getFullYear(), 11, 30);
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

    if (this.summary == "rbShopWiseDailySale") {
      this.OpenSalesDaily(monthStart, monthEnd, YearStart, YearEnd);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbShopWiseItemSales") {
      this.OpenSalesShopSupItem(this.fromDate, this.toDate, this.ShopId, this.prdID, this.itmID, this.supID, this.stockType);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbItemWise") {
      this.OpenSalesItemWise(this.fromDate, this.toDate, this.ShopId, this.prdID, this.itmID, this.supID, this.stockType);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbSalesStockReport") {
      let take = "999999999";
      if (this.all == false)
        take = String(this.txtSStockReport);
      let sortOrder = "RPU";
      if (this.rpu == false)
        sortOrder = "Qty";

      this.OpenSalesStockReport(this.fromDate, this.toDate, this.ShopId, this.prdID, this.itmID, this.supID, take, sortOrder, this.stockType);
      this.calcelButtonClick();

    }
    else if (this.summary == "rbSalesFromStockPer") {
      this.OpenSalesFromStockPercent(this.fromDate, this.toDate, this.ShopId, this.itmID, this.prdID, this.supID, this.stockType);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbSupplierWiseGP") {
      this.OpenSalesSupplierGP(this.fromDate, this.toDate, this.ShopId, this.itmID, this.prdID, this.supID, this.stockType);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbSupplierWiseSalesPercent") {
      this.OpenSalesSupplierSalesPercent(this.fromDate, this.toDate, this.ShopId, this.itmID, this.prdID, this.supID, this.stockType);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbInvoiceWiseSalesSummary") {
      this.OpenSalesInvoiceWiseSalesSummary(this.fromDate, this.toDate, this.ShopId, this.prdID, this.itmID, this.supID, this.stockType);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbInvoiceWiseSalesDetails") {
      this.OpenSalesInvoiceWiseSalesDetails(this.fromDate, this.toDate, this.ShopId, this.prdID, this.itmID, this.supID, this.EmpID, this.stockType);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbGroupWiseSalesReport") {
      this.OpenSalesGroupWise(this.fromDate, this.toDate, this.ShopId, this.itmID, this.prdID, this.supID, this.stockType);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbCashierWiseSalesSummary") {
      this.OpenSalesCashierWiseSummary(this.fromDate, this.toDate, this.ShopId, this.itmID, "All", this.prdID, this.supID, this.stockType);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbSlowMovingItems") {
      this.OpenSalesSlowMovingItems(this.fromDate, this.toDate, this.ShopId, this.itmID, this.prdID, this.supID, this.stockType);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbBasketReport") {
      this.OpenSalesBasketReport(this.fromDate, this.toDate, this.ShopId, this.itmID, this.prdID, this.supID, this.stockType);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbSalesExpenseReport") {
      this.SalesExpenseReport(this.fromDate, this.toDate, this.ShopId, this.UserID);
      this.calcelButtonClick();
    }
    else if (this.summary == "rbEmpWiseExcel") {
      this.OpenSalesEmpExcel(this.fromDate, this.toDate, this.ShopId, this.itmID, this.prdID, this.supID, this.stockType, this.EmpID);
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
    this.EmpID = undefined;
    // this.fromDate = undefined;
    // this.toDate = undefined;
    // this.summary = undefined;
    this.stockType = undefined;
    this.getSupplierList()
    this.getProductList()
  }
  IsSummary(item: any) {
    this.summary = item;
    console.log(this.summary);
    if (this.summary == "rbEmpWiseExcel") {
      this.EmpTypeOnOFF = true;
      this.EmpIDOnOFF = false;
      this.salesStockOnOff = false;
      this.all = true;
      this.rpu = true;
    }
    else if (this.summary == "rbInvoiceWiseSalesDetails") {
      this.EmpIDOnOFF = true;
      this.EmpTypeOnOFF = false;
      this.salesStockOnOff = false;
      this.all = true;
      this.rpu = true;
    }
    else if (this.summary == "rbSalesStockReport") {
      this.salesStockOnOff = true;
      this.EmpTypeOnOFF = false;
      this.EmpIDOnOFF = false;
      this.all = true;
      this.rpu = true;
    }
    else {
      this.EmpTypeOnOFF = false;
      this.EmpIDOnOFF = false;
      this.salesStockOnOff = false;
      this.all = true;
      this.rpu = true;
    }

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
    this.UserID = this.credentinal.credentials?.username;
    this.fromDate = this.formatCurrentDate(new Date()) as any;
    this.toDate = this.formatCurrentDate(new Date()) as any;
    this.getSupplierList()
    this.getProductList()
  }
}
