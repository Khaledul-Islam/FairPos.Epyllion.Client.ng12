import { Component, OnInit, ViewChild } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';
import { ConvModalComponent } from '../conversion-item/conv-modal/conv-modal.component';
import { ItemConv } from '@app/models/ItemConv';
import { Buy } from '@app/models/Buy';
import { TempConversionStock } from '@app/models/TempConvStock';

@Component({
  selector: 'app-conversion-item',
  templateUrl: './conversion-item.component.html',
  styleUrls: ['./conversion-item.component.scss'],
})
export class ConversionItemComponent implements OnInit {
  public SupplierList = [];
  public TempList = [];
  public ItemConv: ItemConv;
  public dataList: ItemConv[];
  public UserID: string | undefined;
  public ShopID: string | undefined;
  public totalqty = 0;
  public details: Buy;
  public TempConvStock: TempConversionStock;
  public TempConvStockList: TempConversionStock[];

  @ViewChild(ConvModalComponent) childItemComponent: any;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {
    this.ItemConv = new ItemConv();
    this.details = new Buy();
    this.dataList = [];
    this.TempConvStock = new TempConversionStock();
    this.TempConvStockList = [];
  }
  async GetItemDetails(sbarCode: any, date: any) {
    let promise = this.http
      .get(this.env.apiUrl + 'ItemConversion/GetItemDetails?ParentSbarcode=' + sbarCode + '&parentItemExpire=' + date)
      .toPromise();
    return promise.then((response) => {
      return (this.dataList = response as ItemConv[]);
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
  async TempConcStockList() {
    let promise = this.http.get(this.env.apiUrl + 'ItemConversion/TempConcStockList').toPromise();
    return promise.then((response) => {
      return (this.TempConvStockList = response as TempConversionStock[]);
    });
  }
  async TempConvStockListByID() {
    let promise = this.http
      .get(this.env.apiUrl + 'ItemConversion/TempConvStockListByID?UserID=' + this.UserID)
      .toPromise();
    return promise.then((response) => {
      return (this.TempList = response as []);
    });
  }

  async SaveTempConvStock() {
    this.TempConvStock.FromBarcodeExp = this.ItemConv.BarCode;
    this.TempConvStock.UserName = this.UserID;
    let promise = this.http.post(this.env.apiUrl + 'ItemConversion/SaveTempConvStock', this.TempConvStock).toPromise();
    return promise.then((response) => {
      return response;
    });
  }
  async GetProductsSupplier(sbarCode: any) {
    let flag = false;
    if (sbarCode) {
      await this.TempConcStockList();
      if (this.TempConvStockList.length > 0) {
        this.TempConvStockList.forEach((element) => {
          if (element.FromBarcodeExp === sbarCode) {
            this.alertService.error('A user already processing this barcode');
            flag = true;
            return;
          }
        });
      }

      if ((flag = false)) {
        await this.GetByBarcodeExp(sbarCode);
        this.Initialize();
        await this.GetItemDetails(this.details.sBarCode, this.details.EXPDT);
        await this.SaveTempConvStock();
      }
    } else {
      if (this.ItemConv.SupID === null || this.ItemConv.SupID === undefined) {
        this.alertService.warning('Supplier is Required');
        return;
      }
      this.childItemComponent.clickFromParent(this.ItemConv.SupID, this.ShopID);
    }
  }

  async GetProductsSupplierInit(sbarCode: any) {
    if (sbarCode) {
      await this.GetByBarcodeExp(sbarCode);
      this.Initialize();
      await this.GetItemDetails(this.details.sBarCode, this.details.EXPDT);
    }
  }

  Initialize() {
    this.ItemConv.BarCode = this.details.BarCode;
    this.ItemConv.sellPrice = this.details.RPU;
    this.ItemConv.ItemFullName = this.details.ProductDescription;
    this.ItemConv.boxQTY = this.details.SaleBalQty;
    this.ItemConv.unitQTY = this.details.balQty;
  }
  async receiveItemSelection($event: any) {
    let data = $event;
    this.details = data['details'] as Buy;
    this.dataList = data['list'];
    this.Initialize();
    await this.SaveTempConvStock();
  }
  qtyChange() {
    this.totalqty = 0;
    this.dataList.forEach((element) => {
      this.totalqty = this.totalqty + Number(element.BoxSize) * Number(element.QTY);
    });
  }
  async supplierDDL() {
    const promise = this.http.get(this.env.apiUrl + 'api/Supplier').toPromise();
    return promise.then(
      (response: any) => {
        return (this.SupplierList = response);
      },
      (error: any) => {
        this.alertService.error(error.error);
      }
    );
  }

  async ngOnInit() {
    await this.supplierDDL();
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    let data: TempConversionStock[];
    data = await this.TempConvStockListByID();
    if (data.length > 0) {
      await this.GetProductsSupplierInit(data[0].FromBarcodeExp);
      this.ItemConv.SupID = this.details.SupID;
    }
  }
  async reportAPICall(idNo: string, header: string) {
    var url_ =
      this.env.reportUrl +
      'Stock/ConversionStockChallanWise?ConversionNo=' +
      idNo +
      '&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  async saveButtonClick() {
    if (this.ItemConv.BarCode == null || this.ItemConv.BarCode == undefined) {
      this.alertService.warning('Barcode is Required');
      return;
    }
    if (this.totalqty > Number(this.ItemConv.unitQTY)) {
      this.alertService.warning('Conversion qty cannot be greater then stock qty');
      return;
    }
    if (Number(this.totalqty) <= 0) {
      this.alertService.warning('Please Select Quantity');
      return;
    }

    this.dataList.forEach((element) => {
      element.totalqty = this.totalqty;
      element.bCode = this.ItemConv.BarCode;
      element.unitQTY = this.ItemConv.unitQTY;
      element.boxQTY = this.ItemConv.boxQTY;
      element.sellPrice = this.ItemConv.sellPrice;
      element.ShopID = this.ShopID;
      element.UserID = this.UserID;
    });
    let promise = this.http
      .post(this.env.apiUrl + 'ItemConversion/SaveConvStock', this.dataList, { responseType: 'text' })
      .toPromise();
    return promise
      .then((res) => {
        this.alertService.success('Save Successfull');
        this.reportAPICall(res, '=');
        this.destroyer();
        return res;
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }
  destroyer() {
    this.ItemConv = new ItemConv();
    this.details = new Buy();
    this.dataList = [];
    this.TempConvStock = new TempConversionStock();
    this.TempConvStockList = [];
    this.TempList = [];
    this.totalqty = 0;
  }
  async backButtonClick() {
    let promise = this.http
      .delete(this.env.apiUrl + 'ItemConversion/DeleteTempConversionStock?UserID=' + this.UserID)
      .toPromise();
    return promise.then((response) => {
      this.destroyer();
      return response;
    });
  }
}
