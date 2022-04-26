import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, DebugElement, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { DataTablesResponse } from '@app/models/DataTablesResponse';
import { ItemList } from '@app/models/ItemList';
import { Result } from '@app/models/Result';
import { EnvService } from '@env/environment';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit {
  public SupplierList = [];
  public ProductList = [];
  public SellUOMList = [];
  public ConvUOMList = [];
  public PackUOMList = [];
  public getItemListDDL: any | undefined;
  public ItemList = [];
  public ItemConvert: any | undefined;
  public addItemList: any | undefined;
  public UserID: string | undefined;
  public ShopID: string | undefined;
  dtOptions: DataTables.Settings = {};
  public model: ItemList;
  public dataList: ItemList[] | undefined;
  public resultMaster: Result | undefined;
  public isInsertMode: boolean;
  public isUpdateMode: boolean;
  public buttonText: string;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private sanitizer: DomSanitizer,
    private credentialsService: CredentialsService
  ) {
    this.isInsertMode = false;
    this.buttonText = 'Save';
    this.isUpdateMode = false;
    this.model = new ItemList();
  }
  async checkBarcode(barcode: any) {
    if (barcode == '' || barcode == undefined || barcode == null) {
      this.alertService.confirm2(
        'Barcode is empty. This means you want to avoid or you do not have product barcode agaist the product. Please decide either you want to use product Barcode or System barcode.If you choose Yes system will back you for scanning product barcode and if you do not system will put system barcode in place of product barcode in stead. Do you want to Scan Product Barcode?',
        () => {
          return;
        },
        () => {
          this.autoGenBarcode();
        }
      );
    }
  }
  deleteButtonClick() {
    this.alertService.confirm('are you sure you want to remove this data', () => {
      this.http
        .post<Result>(this.env.apiUrl + 'ItemList/DeleteStyleSize?sBarcode=' + this.model.sBarcode, null)
        .subscribe(
          (result) => {
            let response = result as any;
            if (response == false) {
              this.alertService.warning('Record is in use');
            }
            if (response == true) {
              this.alertService.success('Data Delete Successfully');
              this.backButtonClick();
            }
          },
          (error) => {
            this.alertService.error(error.error);
          }
        );
    });
  }
  async generateSbarCode() {
    this.http
      .get(this.env.apiUrl + 'ItemList/GeneratesBarCode?SupID=' + this.model.SupID + '&PrdID=' + this.model.PrdID, {
        responseType: 'text',
      })
      .subscribe(
        (response) => {
          this.model.sBarcode = response;
        },
        (error) => {
          this.alertService.error(error.error);
        }
      );
  }
  async autoGenBarcode() {
    let promise = this.http.get(this.env.apiUrl + 'ItemList/GenerateBarCode', { responseType: 'text' }).toPromise();
    return promise.then(
      (response) => {
        return (this.model.Barcode = response);
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  async getItemList() {
    if (this.model.SupID === undefined) {
      this.alertService.warning('Please select Supplier');
    }
    if (this.model.PrdID === undefined) {
      this.alertService.warning('Please select Product');
    }
    if (this.model.SupID && this.model.PrdID) {
      this.http
        .get(this.env.apiUrl + 'ItemList/ItemListDDL?SupID=' + this.model.SupID + '&PrdID=' + this.model.PrdID)
        .subscribe(
          async (result) => {
            this.model.itemsList = result as ItemList;
            this.ItemList = this.model.itemsList as any;
            this.ItemConvert = []; // this is nessesarry to push list here otherwise we cant push in empty object
            await this.generateSbarCode();
          },
          (error) => {
            this.alertService.error(error.error);
          }
        );
    }
  }
  formvalidation() {
    if (this.model.SupID == null || this.model.SupID == undefined) {
      this.alertService.warning('Supplier ID Required');
      return;
    }
    if (this.model.PrdID == null || this.model.PrdID == undefined) {
      this.alertService.warning('Product ID Required');
      return;
    }
    if (this.model.ItemName == null || this.model.ItemName == undefined) {
      this.alertService.warning('Item Name Required');
      return;
    }
    if (this.model.ItemNameBangla == null || this.model.ItemNameBangla == undefined) {
      this.alertService.warning('Item Name Bangla Required');
      return;
    }
    if (this.model.Barcode == null || this.model.Barcode == undefined || this.model.Barcode == '') {
      this.alertService.warning('Barcode Required');
      return;
    }
    if (this.model.sBarcode == null || this.model.sBarcode == undefined) {
      this.alertService.warning('sBarcode Required');
      return;
    }
    if (this.model.UOMId == null || this.model.UOMId == undefined) {
      this.alertService.warning('UOMId Required');
      return;
    }
    if (this.model.RPU == null || this.model.RPU == undefined) {
      this.alertService.warning('Fair Price Required');
      return;
    }
    if (this.model.POPackSize == null || this.model.POPackSize == undefined) {
      this.alertService.warning('Pack Size Required');
      return;
    }
    if (this.model.BoxUOMId == null || this.model.BoxUOMId == undefined) {
      this.alertService.warning('Conversion UOM Required');
      return;
    }
    if (this.model.PackUOMId == null || this.model.PackUOMId == undefined) {
      this.alertService.warning('Pack UOM Required');
      return;
    }
    if (this.model.RPU <= 0) {
      this.alertService.warning('Price should not be 0');
      return;
    }
    return 1;
  }
  saveApiCall() {
    this.model.UserID = this.UserID;
    this.alertService.clear();
    if (this.isUpdateMode) {
      let convurl = 'ItemList/Update';
      this.http.post<Result>(this.env.apiUrl + convurl, this.model).subscribe(
        (result) => {
          this.alertService.success('Data updated Successfully');
          this.backButtonClick();
        },
        (error) => {
          this.alertService.error(error.error);
        }
      );
      return;
    }
    let inserturl: string = 'ItemList/Insert';
    this.http.post<Result>(this.env.apiUrl + inserturl, this.model).subscribe(
      (result) => {
        this.alertService.success('Data updated Successfully');
        this.backButtonClick();
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
    return;
  }
  saveButtonClick() {
    let valid = this.formvalidation();
    if (valid === 1) {
      this.saveApiCall();
    }
  }
  formatCurrentDate(date: any) {
    if (!date) return null;
    if (date.includes('T')) {
      let onlyDate = date.split('T');
      const [year, month, day] = onlyDate[0].split('-');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (date.includes('-')) {
      const [year, month, day] = date.split('-');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (date.includes(' ')) {
      let onlyDate = date.split(' ');
      const [month, day, year] = onlyDate[0].split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else return date;
  }
  initializeData() {
    this.model.ArrivalExpireLimit = 180;
    this.model.ExpireLimit = 7;
    this.model.MaxOrder = 0;
    this.model.DiscPrcnt = 0;
    this.model.RPU = 0.0;
    this.model.ItemWeight = 0.0;
    this.model.Reorder = 0;
    this.model.MinOrder = 0;
    this.model.VATPrcnt = 0;
    this.model.POPackSize = 1;
    this.model.BoxSize = 1;
    this.model.isTrail = true;
  }

  createButtonClick() {
    this.isInsertMode = true;
    this.isUpdateMode = false;
    this.buttonText = 'Save';
    this.model = new ItemList();
    this.initializeData();
  }

  backButtonClick() {
    this.isInsertMode = false;
    this.isUpdateMode = false;
    this.buttonText = 'Save';
  }

  editbuttonClick(id: any) {
    this.alertService.clear();
    this.isInsertMode = true;
    this.model = new ItemList();
    this.buttonText = 'Update';
    this.isUpdateMode = true;
    this.http.get(this.env.apiUrl + 'ItemList/EditItemDetailsBySbarcode?sbarocde=' + id).subscribe(
      (result) => {
        this.model = result as ItemList;
        this.model.trailFrom = this.formatCurrentDate(this.model.trailFrom) as any;
        this.model.trailTo = this.formatCurrentDate(this.model.trailTo) as any;
        this.ItemList = this.model.itemsList as any;
        this.ItemConvert = this.model.itemsConvert as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }

  addItemConvertList(sBarcode: any) {
    this.http.get(this.env.apiUrl + 'ItemList/StyleSizeDetailsBySbarcode?sbarocde=' + sBarcode).subscribe(
      (result) => {
        this.addItemList = result as any;
        if (this.ItemConvert === null) {
          this.ItemConvert = []; // this is nessesarry to push list here otherwise we cant push in empty object
        }
        if (this.ItemConvert !== null) {
          const idx: number = this.ItemConvert.findIndex((obj: { sBarcode: any }) => obj.sBarcode === sBarcode);
          if (idx > -1) {
            this.alertService.warning('Convert Item Already Exist');
          } else {
            this.ItemConvert.push(this.addItemList);
            this.model.itemsConvert = this.ItemConvert;
          }
        }
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }

  deleteItemConvertList(item: any) {
    this.alertService.confirm('are you sure you want to remove this data', () => {
      const index = this.ItemConvert.indexOf(item, 0);
      this.ItemConvert.splice(index, 1);
    });
  }

  loadAllUser() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(this.env.apiUrl + 'ItemList/GetForDataTable', dataTablesParameters, {})
          .subscribe((resp) => {
            that.dataList = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: 'sBarcode' },
        { data: 'Barcode' },
        { data: 'SupName' },
        { data: 'ItemName' },
        { data: 'CPU' },
        { data: 'RPU' },
        { data: 'UOMName' },
        { data: 'BoxSize' },
        { data: 'BOXUOMName' },
        { data: 'IsConverationItem' },
        { defaultContent: '', data: 'Empty', orderable: false },
      ],
    };
  }
  supplierDDL() {
    this.http.get(this.env.apiUrl + 'api/Supplier').subscribe(
      (result) => {
        this.SupplierList = result as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  ProductListDDL() {
    this.http.get(this.env.apiUrl + 'api/Product').subscribe(
      (result) => {
        this.ProductList = result as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  SellUOMDDL() {
    this.http.get(this.env.apiUrl + 'MeasureUnit/GetAll').subscribe(
      (result) => {
        this.SellUOMList = result as any;
        this.ConvUOMList = result as any;
        this.PackUOMList = result as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  ngOnInit(): void {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.loadAllUser();
    this.supplierDDL();
    this.ProductListDDL();
    this.SellUOMDDL();
  }
}
