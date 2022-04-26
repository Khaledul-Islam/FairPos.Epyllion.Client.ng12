import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';
import { Buy } from '@app/models/Buy';
import { TempPriceChanged } from '@app/models/TempPriceChanged';
import { ItemConv } from '@app/models/ItemConv';

@Component({
  selector: 'app-price-change',
  templateUrl: './price-change.component.html',
  styleUrls: ['./price-change.component.scss'],
})
export class PriceChangeComponent implements OnInit {
  public UserID: string | undefined;
  public ShopID: string | undefined;
  public buyDetails: Buy;
  public PriceChangedLst: TempPriceChanged[];
  public totalItem = 0;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {
    this.buyDetails = new Buy();
    this.PriceChangedLst = [];
  }
  async getTempItemList() {
    let promise = this.http
      .get<TempPriceChanged[]>(this.env.apiUrl + 'CircularPriceChanged/GetTempDataByUser?userId=' + this.UserID)
      .toPromise();
    return promise.then((result) => {
      this.PriceChangedLst = result;
      this.totalItem = this.PriceChangedLst.length;
      return result;
    });
  }
  deleteButtonClick(item: TempPriceChanged) {
    this.alertService.confirm('Are you sure to delete ' + item.ProductName, () => {
      let promise = this.http
        .post<TempPriceChanged>(this.env.apiUrl + 'CircularPriceChanged/deleteTempPriceChanged', item)
        .toPromise();
      return promise
        .then((result) => {
          this.getTempItemList();
          return result;
        })
        .catch((error) => {
          this.alertService.error(error.error);
        });
    });
  }
  AddbuttonClick() {
    if (this.buyDetails.BarCode == null || this.buyDetails.BarCode == undefined) {
      this.alertService.warning('Barcode required');
      return;
    }
    if (this.buyDetails.sBarCode == null || this.buyDetails.sBarCode == undefined) {
      this.alertService.warning('Item Not found');
      return;
    }
    let index = this.PriceChangedLst.findIndex((a) => a.Barcode == this.buyDetails.BarCode);
    if (index >= 0) {
      this.alertService.warning(this.buyDetails.ProductDescription + 'already exist');
      this.buyDetails = new Buy();
      return;
    }
    this.buyDetails.UserID = this.UserID;
    let promise = this.http
      .post<TempPriceChanged>(this.env.apiUrl + 'CircularPriceChanged/saveTempPriceChanged', this.buyDetails)
      .toPromise();
    return promise
      .then((result) => {
        this.getTempItemList();
        this.buyDetails = new Buy();
        return result;
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }

  async getProductDetails(BarCode: any) {
    let promise = this.http.get(this.env.apiUrl + 'ItemConversion/GetByBarcodeExp?expbarcode=' + BarCode).toPromise();
    return promise.then((resp) => {
      this.buyDetails = resp as Buy;
      if (this.buyDetails.ProductDescription == null || this.buyDetails.sBarCode == null) {
        this.alertService.warning('No item found');
        return;
      }
      return this.buyDetails;
    });
  }
  async saveButtonClick() {
    if (this.PriceChangedLst.length == 0) {
      this.alertService.warning('No Item to save');
      return;
    }
    this.alertService.confirm('Are you sure to save', () => {
      let promise = this.http
        .post(this.env.apiUrl + 'CircularPriceChanged/savePriceChanged', this.PriceChangedLst)
        .toPromise();
      return promise
        .then((result) => {
          this.buyDetails = new Buy();
          this.alertService.success('Price chnage request submitted successfull');
          this.getTempItemList();
          return result;
        })
        .catch((error) => {
          this.alertService.error(error.error);
        });
    });
  }
  async cancelButtonClick() {
    this.buyDetails = new Buy();
    this.getTempItemList();
  }

  ngOnInit() {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.getTempItemList();
  }
}
