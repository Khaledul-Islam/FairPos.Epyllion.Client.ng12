import { Component, OnInit, ViewChild } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';
import { Buy } from '@app/models/Buy';
import { TempInventory } from '@app/models/TempInventory';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  public UserID: string | undefined;
  public ShopID: string | undefined;
  public buyDetails: Buy;
  public tmpInv: TempInventory;
  public tmpInvList: TempInventory[];

  public totalItemp = 0;
  public totalStockp = 0;
  public rightOffp = 0;
  public rightOnp = 0;
  public newStockp = 0;

  public stock = 0;
  public rightoff = 0;
  public rightonn = 0;
  public newstock = 0;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {
    this.buyDetails = new Buy();
    this.tmpInv = new TempInventory();
    this.tmpInvList = [];
  }
  previewReport() {
    if (this.tmpInvList.length == 0) {
      this.alertService.warning('No item to preview');
      return;
    }
    var url_ =
      this.env.reportUrl +
      'Inventory/InventoryChallan?UserIdOrChallan=' +
      this.UserID +
      '&IsTemp=true&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  async deleteButtonClick(item: TempInventory) {
    this.alertService.confirm('Sure to remove ' + item.ProductDescription, () => {
      let promise = this.http.post<TempInventory>(this.env.apiUrl + 'Inventory/RemoveTempInventory', item).toPromise();
      return promise
        .then((result) => {
          this.alertService.success('Removed from List');
          this.GetTmpInventoryList();
          return result;
        })
        .catch((error) => {
          this.alertService.error(error.error);
        });
    });
  }
  assemble() {
    this.tmpInv.BarCode = this.buyDetails.BarCode;
    this.tmpInv.RPU = this.buyDetails.RPU;
    this.tmpInv.stock = this.stock;
    this.tmpInv.NewStockQty = this.newstock;
    this.tmpInv.ProductDescription = this.buyDetails.ProductDescription;
    this.tmpInv.WriteOffBoxQty = this.rightoff;
    this.tmpInv.WriteOnBoxQty = this.rightonn;
    this.tmpInv.UserID = this.UserID;
    this.tmpInv.UnitUOM = this.buyDetails.UOMName;
  }
  AddbuttonClick() {
    this.assemble();
    if (this.rightonn == 0 && this.rightoff == 0) {
      this.alertService.warning('Enter write off or on qty');
      return;
    }

    if (this.rightonn != 0 && this.rightoff != 0) {
      this.alertService.warning('Invalid write off or on qty');
      return;
    }
    if (this.stock <= 0) {
      if (this.rightoff > 0) {
        this.alertService.warning('Write off not possible for zero stock');
        return;
      }
    }

    let index = this.tmpInvList.findIndex((a) => a.BarCode == this.tmpInv.BarCode);
    if (index >= 0) {
      this.alertService.warning(this.tmpInv.ProductDescription + 'already exist');
      return;
    }
    let promise = this.http
      .post<TempInventory>(this.env.apiUrl + 'Inventory/SaveTempInventory', this.tmpInv)
      .toPromise();
    return promise
      .then((result) => {
        this.GetTmpInventoryList();
        this.buyDetails = new Buy();
        this.stock = 0;
        this.rightoff = 0;
        this.rightonn = 0;
        this.newstock = 0;
        return result;
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }
  async GetTmpInventoryList() {
    let promise = this.http
      .get<TempInventory[]>(this.env.apiUrl + 'Inventory/GetsTempInventory?name=' + this.UserID)
      .toPromise();
    return promise
      .then((result) => {
        this.tmpInvList = result;
        this.totalItemp = this.tmpInvList.length;
        this.totalStockp = this.tmpInvList.reduce(function (sum, value) {
          return sum + Number(value.StockBoxQty);
        }, 0);
        this.rightOffp = this.tmpInvList.reduce(function (sum, value) {
          return sum + Number(value.WriteOffBoxQty);
        }, 0);
        this.rightOnp = this.tmpInvList.reduce(function (sum, value) {
          return sum + Number(value.WriteOnBoxQty);
        }, 0);
        this.newStockp = this.tmpInvList.reduce(function (sum, value) {
          return sum + Number(value.NewStockQty);
        }, 0);
        return this.tmpInvList;
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }
  rightonchange(rightonn: number) {
    this.newstock = Number(this.stock) + Number(rightonn);
    this.rightoff = 0;
  }
  rightoffchange(rightoff: number) {
    this.newstock = Number(this.stock) - Number(rightoff);
    this.rightonn = 0;
  }
  async getProductDetails(BarCode: any) {
    if (BarCode == null || BarCode == undefined) {
      this.alertService.warning('Enter Barcode');
      return;
    }
    let promise = this.http
      .get<Buy>(this.env.apiUrl + 'Inventory/GetByBarcodeExpForInventory?barcode=' + BarCode)
      .toPromise();
    return promise
      .then((result) => {
        this.buyDetails = result;
        console.log(this.buyDetails);
        this.stock = Number(this.buyDetails.balQty) / Number(this.buyDetails.BoxSize);
        return this.buyDetails;
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }
  async reportAPICall(idNo: string, header: string) {
    var url_ =
      this.env.reportUrl +
      'Inventory/InventoryChallan?UserIdOrChallan=' +
      idNo +
      '&IsTemp=false&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  async saveButtonClick() {
    if (this.tmpInvList.length == 0) {
      this.alertService.warning('No item to save');
      return;
    }
    this.tmpInvList.forEach((element) => {
      element.ShopId = this.ShopID;
      element.UserID = this.UserID;
    });
    this.alertService.confirm('Are you sure to save', () => {
      let promise = this.http
        .post(this.env.apiUrl + 'Inventory/SaveInventory', this.tmpInvList, { responseType: 'text' })
        .toPromise();
      return promise
        .then((result) => {
          this.reportAPICall(result, '=');
          this.alertService.success('Data saved successfull');
          this.cancelButtonClick();
          return result;
        })
        .catch((error) => {
          this.alertService.error(error.error);
        });
    });
  }
  async cancelButtonClick() {
    this.buyDetails = new Buy();
    this.stock = 0;
    this.rightoff = 0;
    this.rightonn = 0;
    this.newstock = 0;
    this.GetTmpInventoryList();
  }

  ngOnInit() {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.GetTmpInventoryList();
  }
}
