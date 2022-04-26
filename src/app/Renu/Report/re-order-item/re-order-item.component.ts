import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';


@Component({
  selector: 'app-re-order-item',
  templateUrl: './re-order-item.component.html',
  styleUrls: ['./re-order-item.component.scss']
})
export class ReOrderItemComponent implements OnInit {

  public supID: string | undefined;
  public prdID: string | undefined;
  public itmID: string | undefined;
  public conv: boolean | undefined;

  public supList = [];
  public prdList = [];
  public itmList = [];


  constructor(private http: HttpClient, private alertService: AlertService
    , private env: EnvService
    , private sanitizer: DomSanitizer
    , private credentinal: CredentialsService) {
  }
  IsConvItem(item: any) {
    this.conv = item;
    console.log(this.conv);

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
    let reportType;
    if (this.conv == true) {
      reportType = "C";
    }
    if (this.conv == false) {
      reportType = "NC";
    }
    if ((this.supID == null || this.supID == undefined) && (this.prdID == null || this.prdID == undefined) && (this.itmID == null || this.itmID == undefined)) {
      this.supID = "ALL"
      this.prdID = "ALL"
      this.itmID = "ALL"
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
    if (this.conv == undefined) {
      this.alertService.warning("select conversion type")
      return
    }
    var url_ = this.env.reportUrl + 'ItemReorder/ItemReorder?ProductId=' + this.prdID + '&ItemId=' + this.itmID + '&SupId=' + this.supID + '&ReportType=' + reportType + '&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
    this.calcelButtonClick();

  }

  calcelButtonClick() {
    this.supList = [];
    this.prdList = [];
    this.itmList = [];
    this.conv = undefined;
    this.itmID = undefined;
    this.prdID = undefined;
    this.supID = undefined;
    this.getSupplierList()
    this.getProductList()
  }


  ngOnInit() {
    this.getSupplierList()
    this.getProductList()
  }


}
