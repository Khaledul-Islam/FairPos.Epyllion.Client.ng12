import { Component, OnInit, ViewChild } from '@angular/core';
import { BuyOrderTemp } from '@app/models/BuyOrderTemp';
import { PurchaseOrder } from '@app/models/PurchaseOrder';
import { Supplier } from '@app/models/Supplier';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth/credentials.service';
import { ItemSelectionSupplierComponent } from '../item-selection-supplier/item-selection-supplier.component';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DataTablesResponse } from '@app/models/DataTablesResponse';

@Component({
  selector: 'app-purchase-order-update',
  templateUrl: './purchase-order-update.component.html',
  styleUrls: ['./purchase-order-update.component.scss'],
})
export class PurchaseOrderUpdateComponent implements OnInit {
  public SupplierList = [];
  public shopList = [];
  public poList = [];
  public poListselected: string | undefined;
  public monthlyBudget = 0;
  public PaymentTerms = [
    {
      Name: 'Accounts Payee',
      Value: 1,
    },
    {
      Name: 'Cash Cheque',
      Value: 2,
    },
    {
      Name: 'Pay Order',
      Value: 3,
    },
    {
      Name: 'BEFTN',
      Value: 4,
    },
  ];
  public MaturityDays = [
    {
      Name: '15',
      Value: 15,
    },
    {
      Name: '30',
      Value: 30,
    },
    {
      Name: '45',
      Value: 45,
    },
    {
      Name: '60',
      Value: 60,
    },
    {
      Name: '90',
      Value: 90,
    },
    {
      Name: '120',
      Value: 120,
    },
  ];
  public GrantTotal = 0;
  public GrantQuantity = 0;
  public ItemQuantity = 0;
  public OrderDate = new Date();
  public BuyOrderTemp: BuyOrderTemp[];
  public ReceiveFromClild: BuyOrderTemp[];
  public OrderTemp: BuyOrderTemp;
  public SupplierInfo: Supplier;
  public PurchaseOrderTemp: PurchaseOrder;
  public ShopID: string | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: any;

  @ViewChild(ItemSelectionSupplierComponent) childItemComponent: any;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {
    this.PurchaseOrderTemp = new PurchaseOrder();
    this.OrderTemp = new BuyOrderTemp();
    this.SupplierInfo = new Supplier();
    this.BuyOrderTemp = [];
    this.ReceiveFromClild = [];
  }
  Initialize() {
    this.OrderTemp.CmpIDX = this.PurchaseOrderTemp.CMPIDX;
    this.OrderTemp.BarCode = this.PurchaseOrderTemp.Barcode;
    this.OrderTemp.PrdDescription = this.PurchaseOrderTemp.ItemFullName;
    this.OrderTemp.RPU = this.PurchaseOrderTemp.RPU;
    this.OrderTemp.POPackQty = this.PurchaseOrderTemp.POPackSizeQTY;
    this.OrderTemp.PackUOM = this.PurchaseOrderTemp.PackUiomName;
    this.OrderTemp.UnitUOM = this.PurchaseOrderTemp.BOXUOMName;
    this.OrderTemp.sBarCode = this.PurchaseOrderTemp.sBarcode;
    this.OrderTemp.PrdID = this.PurchaseOrderTemp.PrdID;
    this.OrderTemp.ItemName = this.PurchaseOrderTemp.ItemName;
    this.OrderTemp.ItemNameBangla = this.PurchaseOrderTemp.ItemNameBangla;
    this.OrderTemp.DiscPrcnt = this.PurchaseOrderTemp.DiscPrcnt;
    this.OrderTemp.VATPrcnt = this.PurchaseOrderTemp.VATPrcnt;
    this.OrderTemp.PrdComm = this.PurchaseOrderTemp.PrdComm;
    this.OrderTemp.CPU = this.PurchaseOrderTemp.CPU;
    this.OrderTemp.RPP = this.PurchaseOrderTemp.RPP;
    this.OrderTemp.WSP = this.PurchaseOrderTemp.WSP;
    this.OrderTemp.WSQ = this.PurchaseOrderTemp.WSQ;
    this.OrderTemp.DisContinued = this.PurchaseOrderTemp.DisContinued;
    this.OrderTemp.SupID = this.PurchaseOrderTemp.SupID;
    this.OrderTemp.ENTRYDT = this.PurchaseOrderTemp.ENTRYDT;
    this.OrderTemp.ZoneID = this.PurchaseOrderTemp.ZoneID;
    this.OrderTemp.Reorder = this.PurchaseOrderTemp.Reorder;
    this.OrderTemp.MaxOrder = this.PurchaseOrderTemp.MaxOrder;
    this.OrderTemp.UOMId = this.PurchaseOrderTemp.UOMId;
    this.OrderTemp.ExpireLimit = this.PurchaseOrderTemp.ExpireLimit;
    this.OrderTemp.AutoSale = this.PurchaseOrderTemp.AutoSale;
    this.OrderTemp.BoxSize = this.PurchaseOrderTemp.BoxSize;
    this.OrderTemp.BoxUOMId = this.PurchaseOrderTemp.BoxUOMId;
    this.OrderTemp.IsConverationItem = this.PurchaseOrderTemp.IsConverationItem;
    this.OrderTemp.MinOrder = this.PurchaseOrderTemp.MinOrder;
    this.OrderTemp.ArrivalExpireLimit = this.PurchaseOrderTemp.ArrivalExpireLimit;
    this.OrderTemp.POPackSize = this.PurchaseOrderTemp.POPackSize;
    this.OrderTemp.PackUOMId = this.PurchaseOrderTemp.PackUOMId;
    this.OrderTemp.ItemWeight = this.PurchaseOrderTemp.ItemWeight;
    this.OrderTemp.IsEssentialItem = this.PurchaseOrderTemp.IsEssentialItem;
    this.OrderTemp.PrdName = this.PurchaseOrderTemp.PrdName;
    this.OrderTemp.UOMName = this.PurchaseOrderTemp.UOMName;
    this.OrderTemp.PackUiomName = this.PurchaseOrderTemp.PackUiomName;
    this.OrderTemp.SupName = this.PurchaseOrderTemp.SupName;
    this.OrderTemp.balQty = this.PurchaseOrderTemp.totalstock;
    this.OrderTemp.ItemFullName = this.PurchaseOrderTemp.ItemFullName;
    this.OrderTemp.isAuthorized = this.PurchaseOrderTemp.isAuthorized;
    this.OrderTemp.PaymentTermID = this.PurchaseOrderTemp.PaymentTermID;
    this.OrderTemp.MaturityDaysID = this.PurchaseOrderTemp.MaturityDaysID;
    this.OrderTemp.DeliveryDate = this.PurchaseOrderTemp.DeliveryDate;
    this.OrderTemp.Qty = this.PurchaseOrderTemp.QTY;
    this.OrderTemp.QtrefNo = this.PurchaseOrderTemp.QtrefNo;
    this.OrderTemp.PartialDelivery = this.PurchaseOrderTemp.PartialDelivery;
  }
  CheckStatus() {
    if (this.SupplierInfo === null || this.SupplierInfo === undefined) {
      return;
    }
    if (this.SupplierInfo.chkAC) {
      this.PurchaseOrderTemp.PaymentTermID = 1;
    }
    if (this.SupplierInfo.chkPO) {
      this.PurchaseOrderTemp.PaymentTermID = 3;
    }
    if (this.SupplierInfo.chkCashCheq && this.SupplierInfo.chkCashCheq) {
      this.PurchaseOrderTemp.PaymentTermID = 2;
    }
    if (this.SupplierInfo.chkBEFTN && this.SupplierInfo.chkCashCheq) {
      this.PurchaseOrderTemp.PaymentTermID = 4;
    }
    if (this.SupplierInfo.MaturityDays) {
      this.PurchaseOrderTemp.MaturityDaysID = this.SupplierInfo.MaturityDays;
    }
  }
  CalculatePackSize() {
    this.PurchaseOrderTemp.QTY =
      Number(this.PurchaseOrderTemp.POPackSizeQTY) * Number(this.PurchaseOrderTemp.POPackSize);
  }
  GetProductStock(sBarcode: any) {
    this.http
      .get(this.env.apiUrl + 'PurchaseOrder/GetActualStockBySbarocde?sBarcode=' + sBarcode, { responseType: 'text' })
      .subscribe(
        (result) => {
          this.PurchaseOrderTemp.totalstock = result as any;
        },
        (error) => {
          this.alertService.error(error.error);
        }
      );
  }
  formatCurrentDate(date: any) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    //var today = day + "-" + month + "-" + year;
    var today = year + '-' + month + '-' + day;
    return today;
  }
  formatDate(input: any) {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2];
    return day + '-' + month + '-' + year;
  }
  GetProductDetails(Barcode: any) {
    if (Barcode) {
      this.http.get(this.env.apiUrl + 'ItemList/ApprovedItembyBarcode?barocde=' + Barcode).subscribe(
        (result) => {
          if (result === null || result === undefined) {
            this.alertService.error('Invalid/UnAuthorized Item');
            return;
          }
          this.PurchaseOrderTemp = result as PurchaseOrder;
          this.GetProductStock(this.PurchaseOrderTemp.sBarcode);
          this.ChangeSupplier(this.PurchaseOrderTemp.SupID);
          this.CheckStatus();
          this.Initialize();
        },
        (error) => {
          this.alertService.error(error.error);
        }
      );
    } else {
      if (this.PurchaseOrderTemp.SupID === undefined || this.PurchaseOrderTemp.SupID === null) {
        this.alertService.warning('Supplier is undefined');
        return;
      }
      this.childItemComponent.clickFromParent(this.PurchaseOrderTemp.SupID);
    }
  }

  async receiveItemSelection($event: any) {
    this.ReceiveFromClild = $event;
    this.ReceiveFromClild.forEach(async (element) => {
      element.UserID = this.credentialsService.credentials?.username;
      element.ShopID = this.ShopID;
      element.PrdDescription = element.ItemFullName;
      element.POPackQty = element.POPackSizeQTY;
      element.PackUOM = element.PackUiomName;
      element.UnitUOM = element.BOXUOMName;
      element.DeliveryDate = new Date();
      await this.saveProductAPI(element);
      this.GetBuyOrderTempList();
      this.rerender();
    });
  }
  formatCurrentDate2(date: any) {
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
  GetBuyOrderTempList() {
    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: false,
      searching: false,
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.search.username = this.credentialsService.credentials?.username;
        dataTablesParameters.search.branchid = this.ShopID;
        that.http
          .post<DataTablesResponse>(this.env.apiUrl + 'PurchaseOrder/GetTempDataTableEdit', dataTablesParameters, {})
          .subscribe((resp) => {
            that.BuyOrderTemp = resp.data as BuyOrderTemp[];
            this.ItemQuantity = 0;
            this.GrantTotal = 0;
            if (this.BuyOrderTemp.length > 0) {
              this.BuyOrderTemp.forEach((element) => {
                let sum = Number(element.RPU) * Number(element.Qty);
                this.GrantTotal = Number(this.GrantTotal) + sum;
                this.ItemQuantity = Number(this.ItemQuantity) + Number(element.Qty); /// ekahne kaz ase
                this.PurchaseOrderTemp.SupID = element.SupID;
                element.DeliveryDate = this.formatCurrentDate2(element.DeliveryDate);
              });
              this.ChangeSupplier(this.PurchaseOrderTemp.SupID);
              this.GrantQuantity = this.BuyOrderTemp.length;
              this.poListselected = this.BuyOrderTemp[0].Chln;
            }

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: 'BarCode' },
        { data: 'PrdDescription' },
        { data: 'RPU' },
        { data: 'POPackQty' },
        { data: 'PackUOM' },
        { data: 'Qty' },
        { data: 'UnitUOM' },
        { data: 'DeliveryDate' },
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
  ShopListDDL() {
    this.http.get(this.env.apiUrl + 'api/ShopList').subscribe(
      (result) => {
        this.shopList = result as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  async GetPONotReceived(supid: any) {
    if (supid == undefined) {
      return;
    }
    this.poList = [];
    let promise = this.http
      .get<Supplier>(this.env.apiUrl + 'PurchaseOrder/GetPONotReceived?supplierId=' + supid)
      .toPromise();
    return promise
      .then((resp) => {
        this.poList = resp as any;
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }
  ChangeSupplier(SupID: any) {
    this.http.get<Supplier>(this.env.apiUrl + 'api/Supplier/get_details_by_id?id=' + SupID).subscribe(
      (result) => {
        this.SupplierInfo = result['Data'];
        this.CheckStatus();
        this.GetPONotReceived(SupID);
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  async GetCurrentMonthShopBudget() {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = new Date().getFullYear();
    let promise = this.http
      .get(
        this.env.apiUrl +
          'MonthlyBudget/GetCurrentMonthShopBudget?year=' +
          year +
          '&month=' +
          month +
          '&ShopID=' +
          this.ShopID
      )
      .toPromise();
    return promise
      .then((resp) => {
        return (this.monthlyBudget = resp as number);
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  changeShop() {
    this.GetCurrentMonthShopBudget();
  }
  ngOnInit(): void {
    this.supplierDDL();
    this.ShopListDDL();
    this.OrderTemp.UserID = this.credentialsService.credentials?.username;
    this.GetBuyOrderTempList();
    this.PurchaseOrderTemp.DeliveryDate = this.formatCurrentDate(new Date()) as any;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.GetCurrentMonthShopBudget();
  }
  AddProduct() {
    if (this.PurchaseOrderTemp.SupID == undefined || this.PurchaseOrderTemp.SupID == null) {
      this.alertService.warning('Supplier Required');
      return;
    }
    if (this.PurchaseOrderTemp.Barcode == undefined || this.PurchaseOrderTemp.Barcode == null) {
      this.alertService.warning('Please insert barcode');
      return;
    }
    if (this.PurchaseOrderTemp.DeliveryDate == undefined || this.PurchaseOrderTemp.DeliveryDate == null) {
      this.alertService.warning('Delivery Date Required');
      return;
    }
    if (this.PurchaseOrderTemp.POPackSizeQTY == undefined || this.PurchaseOrderTemp.POPackSizeQTY == null) {
      this.alertService.warning('Pack Size Required');
      return;
    }
    if (this.PurchaseOrderTemp.QTY != undefined || this.PurchaseOrderTemp.QTY != null) {
      this.PurchaseOrderTemp.QTY = Number(this.PurchaseOrderTemp.QTY) / Number(this.PurchaseOrderTemp.BoxSize);
    }
    if (Number(this.PurchaseOrderTemp.QTY) <= 0) {
      this.alertService.warning('Order QTY Required');
      return;
    }
    if (Number(this.PurchaseOrderTemp.QTY) < Number(this.PurchaseOrderTemp.MinOrder)) {
      this.alertService.warning('Minimum order qty level not reached');
      return;
    }
    if (Number(this.PurchaseOrderTemp.QTY) > Number(this.PurchaseOrderTemp.MaxOrder)) {
      this.alertService.warning('Maximum order qty level exceed');
      return;
    }
    if (this.BuyOrderTemp === null) {
      this.BuyOrderTemp = [];
    }
    if (this.BuyOrderTemp !== null) {
      let a;
      let b;
      var found = this.BuyOrderTemp.findIndex((itm) => {
        a = this.formatDate(itm.DeliveryDate);
        b = this.formatDate(this.PurchaseOrderTemp.DeliveryDate);
        return itm.BarCode === this.PurchaseOrderTemp.Barcode && a === b;
      });
      if (found > -1) {
        this.CalculatePackSize();
        this.Initialize();
        this.alertService.confirm('Product Already Exist.Want to replace this ???', () => {
          this.OrderTemp.isEdit = true;
          this.OrderTemp.isAdd = false;
          let total = Number(this.PurchaseOrderTemp.RPU) * Number(this.PurchaseOrderTemp.QTY);
          this.GrantTotal = this.GrantTotal + total;
          this.GrantQuantity = this.GrantQuantity + 1;
          this.ItemQuantity = this.ItemQuantity + Number(this.PurchaseOrderTemp.QTY);
          this.OrderTemp.UserID = this.credentialsService.credentials?.username;
          this.OrderTemp.ShopID = this.ShopID;
          this.saveProductAPI(this.OrderTemp);
          this.GetBuyOrderTempList();
          this.rerender();

          this.PurchaseOrderTemp = new PurchaseOrder();
          this.OrderTemp = new BuyOrderTemp();
          this.SupplierInfo = new Supplier();
        });
      } else {
        this.CalculatePackSize();
        this.Initialize();
        this.OrderTemp.isEdit = false;
        this.OrderTemp.isAdd = true;
        let total = Number(this.PurchaseOrderTemp.RPU) * Number(this.PurchaseOrderTemp.QTY);
        this.GrantTotal = this.GrantTotal + total;
        this.GrantQuantity = this.GrantQuantity + 1;
        this.ItemQuantity = this.ItemQuantity + Number(this.PurchaseOrderTemp.QTY);
        this.OrderTemp.UserID = this.credentialsService.credentials?.username;
        this.OrderTemp.ShopID = this.ShopID;
        this.saveProductAPI(this.OrderTemp);
        this.GetBuyOrderTempList();
        this.rerender();
        this.PurchaseOrderTemp = new PurchaseOrder();
        this.OrderTemp = new BuyOrderTemp();
        this.SupplierInfo = new Supplier();
      }
    }
  }
  updateTmpPurchaseEdit(item: BuyOrderTemp) {
    this.alertService.confirm2(
      'Are you sure to modify the data',
      () => {
        const promise = this.http
          .post<BuyOrderTemp>(this.env.apiUrl + 'PurchaseOrder/updateTmpPurchaseEdit', item)
          .toPromise();
        return promise
          .then((resp) => {
            this.alertService.success('Data updated');
            this.GetBuyOrderTempList();
            this.rerender();
            return resp;
          })
          .catch((error) => {
            this.alertService.error(error.error);
          });
      },
      () => {
        this.GetBuyOrderTempList();
        this.rerender();
      }
    );
  }
  updateTmpPurchaseEdit2(item: BuyOrderTemp) {
    console.log(item);
    this.alertService.confirm2(
      'Are you sure to modify the data',
      () => {
        item.Qty = Number(item.POPackSize) * Number(item.POPackQty) * Number(item.BoxSize);
        const promise = this.http
          .post<BuyOrderTemp>(this.env.apiUrl + 'PurchaseOrder/updateTmpPurchaseEdit', item)
          .toPromise();
        return promise
          .then((resp) => {
            this.alertService.success('Data updated');
            this.GetBuyOrderTempList();
            this.rerender();
            return resp;
          })
          .catch((error) => {
            this.alertService.error(error.error);
          });
      },
      () => {
        this.GetBuyOrderTempList();
        this.rerender();
      }
    );
  }
  updateTmpPurchaseEdit3(item: BuyOrderTemp) {
    this.alertService.confirm2(
      'Are you sure to modify the data',
      () => {
        item.POPackQty = Number(item.Qty) / Number(item.BoxSize) / Number(item.POPackSize);
        const promise = this.http
          .post<BuyOrderTemp>(this.env.apiUrl + 'PurchaseOrder/updateTmpPurchaseEdit', item)
          .toPromise();
        return promise
          .then((resp) => {
            this.alertService.success('Data updated');
            this.GetBuyOrderTempList();
            this.rerender();
            return resp;
          })
          .catch((error) => {
            this.alertService.error(error.error);
          });
      },
      () => {
        this.GetBuyOrderTempList();
        this.rerender();
      }
    );
  }
  LoadProduct() {
    if (this.PurchaseOrderTemp.SupID == null || this.PurchaseOrderTemp.SupID == undefined) {
      this.alertService.warning('Select Supplier');
      return;
    }
    if (this.poListselected == null || this.poListselected == undefined) {
      this.alertService.warning('Select P/O Number');
      return;
    }
    let promise = this.http
      .get(
        this.env.apiUrl +
          'PurchaseOrder/POEditTempSave?pono=' +
          this.poListselected +
          '&userid=' +
          this.OrderTemp.UserID +
          '&shopid=' +
          this.ShopID
      )
      .toPromise();
    return promise
      .then((resp) => {
        this.GetBuyOrderTempList();
        this.rerender();
        return resp as any;
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }
  async clearButtonClick() {
    if (this.BuyOrderTemp.length == 0) {
      this.alertService.warning('No item to delete');
      return;
    }
    this.alertService.confirm('Are you sure to clean the data', () => {
      let promise = this.http
        .get(
          this.env.apiUrl +
            'PurchaseOrder/DeletePOEditAll?userid=' +
            this.OrderTemp.UserID +
            '&shopid=' +
            this.ShopID +
            '&chln=' +
            this.poListselected
        )
        .toPromise();
      return promise
        .then((resp) => {
          this.SupplierInfo = new Supplier();
          this.GrantTotal = 0;
          this.GrantQuantity = 0;
          this.ItemQuantity = 0;
          this.OrderDate = new Date();
          this.poListselected = undefined;
          this.PurchaseOrderTemp.PaymentTermID = undefined;
          this.PurchaseOrderTemp.MaturityDaysID = undefined;
          this.PurchaseOrderTemp.QtrefNo = undefined;
          this.PurchaseOrderTemp.PartialDelivery = undefined;
          this.GetBuyOrderTempList();
          this.rerender();
          return resp as any;
        })
        .catch((error) => {
          this.alertService.error(error.error);
        });
    });
  }
  async saveProductAPI(model: BuyOrderTemp) {
    let promise = this.http.post(this.env.apiUrl + 'PurchaseOrder/CreateBuyOrderEditTemp', model).toPromise();
    return promise
      .then((resp) => {
        this.GetBuyOrderTempList();
        this.rerender();
        return resp;
      })
      .catch((error) => {
        this.alertService.warning(error.error);
      });
  }
  previewReport() {
    if (this.PurchaseOrderTemp.MaturityDaysID == undefined || this.PurchaseOrderTemp.MaturityDaysID == null) {
      this.alertService.warning('Select maturity days');
      return;
    }
    if (this.PurchaseOrderTemp.QtrefNo == undefined || this.PurchaseOrderTemp.QtrefNo == null) {
      this.PurchaseOrderTemp.QtrefNo = '';
    }
    if (this.PurchaseOrderTemp.PartialDelivery == undefined || this.PurchaseOrderTemp.PartialDelivery == null) {
      this.PurchaseOrderTemp.PartialDelivery = true;
    }
    var url_ =
      this.env.reportUrl +
      'PurchaseOrder/PurchaseOrderReportPreview2?userId=' +
      this.OrderTemp.UserID +
      '&matrutitydays=' +
      this.PurchaseOrderTemp.MaturityDaysID +
      '&partialDel=' +
      this.PurchaseOrderTemp.PartialDelivery +
      '&QutRefNo=' +
      this.PurchaseOrderTemp.QtrefNo +
      '&paymentTerms=' +
      this.PurchaseOrderTemp.PaymentTermID +
      '&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  async reportAPICall(chln: string, header: string) {
    var url_ =
      this.env.reportUrl +
      'PurchaseOrder/PurchaseOrderChallanWise?challan_no=' +
      chln +
      '&ReportType=' +
      header +
      '&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  saveButtonClick() {
    if (this.GrantTotal > this.monthlyBudget) {
      this.alertService.error('Budget limit exceeded');
      this.alertService.warning('Adjust P/O or Contact to Administrator');
      return;
    }
    if (this.PurchaseOrderTemp.SupID == undefined || this.PurchaseOrderTemp.SupID == null) {
      this.alertService.warning('Please Select Supplier');
      return;
    }
    if (this.BuyOrderTemp.length == 0 || this.BuyOrderTemp.length == null) {
      this.alertService.warning('No Data Found');
      return;
    }
    if (
      Number(this.PurchaseOrderTemp.MaturityDaysID) < 0 ||
      this.PurchaseOrderTemp.MaturityDaysID == null ||
      this.PurchaseOrderTemp.MaturityDaysID == undefined
    ) {
      this.alertService.warning('Select Maturity Date');
      return;
    }
    if (
      Number(this.PurchaseOrderTemp.PaymentTermID) < 0 ||
      this.PurchaseOrderTemp.PaymentTermID == null ||
      this.PurchaseOrderTemp.PaymentTermID == undefined
    ) {
      this.alertService.warning('Select Payment Terms');
      return;
    }
    this.alertService.confirm('are you sure you want to save this data', () => {
      let PaymentTerm = this.PaymentTerms.find((a) => a.Value == this.PurchaseOrderTemp.PaymentTermID) as any;
      this.BuyOrderTemp.forEach((element) => {
        element.QtrefNo = this.PurchaseOrderTemp.QtrefNo;
        element.PartialDelivery = this.PurchaseOrderTemp.PartialDelivery;
        element.MaturityDaysID = this.PurchaseOrderTemp.MaturityDaysID;
        element.PaymentTermName = PaymentTerm.Name as string;
        element.ShopID = this.ShopID;
        element.UserID = this.credentialsService.credentials?.username;
      });
      let promise = this.http
        .post(this.env.apiUrl + 'PurchaseOrder/PurchaseOrderEditSave', this.BuyOrderTemp, { responseType: 'text' })
        .toPromise();
      return promise
        .then((result) => {
          this.alertService.success('Purchase edit Successful');
          this.PurchaseOrderTemp = new PurchaseOrder();
          this.OrderTemp = new BuyOrderTemp();
          this.SupplierInfo = new Supplier();
          this.BuyOrderTemp = [];
          this.GrantTotal = 0;
          this.GrantQuantity = 0;
          this.ItemQuantity = 0;
          this.OrderDate = new Date();
          this.poListselected = undefined;
          this.GetBuyOrderTempList();
          this.rerender();
          this.reportAPICall(result, 'Supply Chain Copy');
          this.reportAPICall(result, 'Book Copy');
          this.reportAPICall(result, "Supplier's Copy");
        })
        .catch((error) => {
          this.alertService.error(error.error);
        });
    });
  }
  backButtonClick() {
    this.PurchaseOrderTemp = new PurchaseOrder();
    this.OrderTemp = new BuyOrderTemp();
    this.SupplierInfo = new Supplier();
    this.BuyOrderTemp = [];
    this.GrantTotal = 0;
    this.GrantQuantity = 0;
    this.ItemQuantity = 0;
    this.OrderDate = new Date();
    this.GetBuyOrderTempList();
    this.rerender();
  }
  deleteButtonClick(item: BuyOrderTemp) {
    this.alertService.confirm('are you sure you want to remove this data', () => {
      let promise = this.http
        .post(this.env.apiUrl + 'PurchaseOrder/RemoveBuyOrderTempEditByID?barCode=' + item.BarCode, null)
        .toPromise();
      return promise
        .then((resp) => {
          this.GrantTotal = this.GrantTotal - Number(item.Qty) * Number(item.RPU);
          this.GrantQuantity = this.GrantQuantity - 1;
          this.ItemQuantity = this.ItemQuantity - Number(item.Qty);
          this.rerender();
          this.alertService.success('Data Delete Successfully');
        })
        .catch((error) => {
          this.alertService.error(error.error);
        });
    });
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
