import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { Buy } from '@app/models/Buy';
import { TempConversionStock } from '@app/models/TempConvStock';
import { EnvService } from '@env/environment';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-conv-modal',
  templateUrl: './conv-modal.component.html',
  styleUrls: ['./conv-modal.component.scss'],
})
export class ConvModalComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  public dataList: Buy[];
  public newdataList: Buy[];
  public newdataListdetails: Buy[];
  public Buy: Buy;
  public details: Buy;
  public TempConvStock: TempConversionStock;
  public TempConvStockList: TempConversionStock[];
  public closeResult: string;
  public supId: string;
  private modalReference: any;
  public shopid: string;
  public childitemflag: boolean = true;
  public UserID: string | undefined;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private env: EnvService,
    private alertService: AlertService,
    private credentialsService: CredentialsService
  ) {
    this.Buy = new Buy();
    this.details = new Buy();
    this.TempConvStock = new TempConversionStock();
    this.dataList = [];
    this.newdataList = [];
    this.newdataListdetails = [];
    this.TempConvStockList = [];
    this.closeResult = '';
    this.supId = '';
    this.shopid = '';
  }

  ngOnInit(): void {
    this.loadDataTables();
    this.UserID = this.credentialsService.credentials?.username;
  }

  destroyer() {
    this.Buy = new Buy();
    this.TempConvStock = new TempConversionStock();
    this.dataList = [];
    this.newdataList = [];
    this.newdataListdetails = [];
    this.TempConvStockList = [];
    this.closeResult = '';
    this.supId = '';
    this.shopid = '';
  }
  @Output() SelectEvent = new EventEmitter<object>();

  close(content: any) {
    //close btn execute
    this.childitemflag = true;
    this.dataList = [];
    this.newdataList = [];
    this.modalReference.close();
  }

  clickFromParent(_supid: string, _shopid: string) {
    // 1st execute
    this.supId = _supid;
    this.shopid = _shopid;
    setTimeout(() => {
      let element: HTMLElement = document.getElementById('btnLoadItemlist') as HTMLElement;
      element.click();
    }, 1);
  }

  open(content: any) {
    let options: NgbModalOptions = {
      size: 'xl', //but this work on this
      backdrop: 'static',
      keyboard: false,
      centered: true,
    };
    this.modalReference = this.modalService.open(content, options);
  }
  saveButtonClick(item: any) {
    // this.SelectEvent.emit(item);
    // this.modalReference.close();
    // this.Buy = new Buy();
  }
  backModalClick() {
    this.childitemflag = true;
    this.newdataList = [];
  }
  async GetNewBarcodeBySbarcode() {
    let promise = this.http
      .get(
        this.env.apiUrl + 'ItemConversion/GetNewBarcodeBySbarcode?sBarcode=' + this.Buy.sBarCode + '&qty=999999999999'
      )
      .toPromise();
    return promise.then((response) => {
      return (this.newdataList = response as Buy[]);
    });
  }

  async TempConcStockList() {
    let promise = this.http.get(this.env.apiUrl + 'ItemConversion/TempConcStockList').toPromise();
    return promise.then((response) => {
      return (this.TempConvStockList = response as TempConversionStock[]);
    });
  }
  async GetItemDetails(sbarCode: any, date: any) {
    let promise = this.http
      .get(this.env.apiUrl + 'ItemConversion/GetItemDetails?ParentSbarcode=' + sbarCode + '&parentItemExpire=' + date)
      .toPromise();
    return promise.then((response) => {
      return (this.newdataListdetails = response as Buy[]);
    });
  }
  async GetByBarcodeExp(expbarcode: any) {
    let promise = this.http
      .get(this.env.apiUrl + 'ItemConversion/GetByBarcodeExp?expbarcode=' + expbarcode)
      .toPromise();
    return promise.then((response) => {
      return (this.details = response as Buy);
    });
  }
  async selectButtonClick(item: any) {
    this.Buy = item;
    this.childitemflag = false;
    await this.GetNewBarcodeBySbarcode();
  }
  async addButtonClick(item: Buy) {
    let flag = false;
    await this.TempConcStockList();
    if (this.TempConvStockList.length > 0) {
      this.TempConvStockList.forEach((element) => {
        if (element.FromBarcodeExp === item.BarCode) {
          this.alertService.error('A user already processing this barcode');
          flag = true;
          this.modalReference.close();
          return;
        }
      });
    }
    if (flag == false) {
      await this.GetItemDetails(item.sBarCode, item.EXPDT);
      await this.GetByBarcodeExp(item.BarCode);
      let object = {
        details: this.details,
        list: this.newdataListdetails,
      };
      this.SelectEvent.emit(object);
      this.modalReference.close();
      this.destroyer();
    }
  }
  loadDataTables() {
    const that = this;
    this.dtOptions = {
      ajax: (any, callback) => {
        that.http
          .get(this.env.apiUrl + 'ItemConversion/GetProductsSupplier?SupId=' + this.supId + '&ShopID=' + this.shopid)
          .subscribe((resp) => {
            that.dataList = resp as Buy[];
            callback({
              data: [],
            });
          });
      },
    };
  }
  //   let promise = this.http.get(this.env.apiUrl+'ItemConversion/GetProductsSupplier?SupId='+this.supId+'&ShopID='+this.shopid).toPromise();
  //   return promise.then(response=>{
  //     return this.dataList=response as Buy[];
  //   })
  // }
}
