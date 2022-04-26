import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';
import { Supplier } from '@app/models/Supplier';
import { BuyOrderReqTemp } from '@app/models/BuyOrderReqTemp';

@Component({
  selector: 'app-requisition-to-purchase-order',
  templateUrl: './requisition-to-purchase-order.component.html',
  styleUrls: ['./requisition-to-purchase-order.component.scss'],
})
export class RequisitionToPurchaseOrderComponent implements OnInit {
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
  public SupplierList: Supplier[];
  public RequisitionList = [];
  public SupplierInfo: Supplier;
  public ReqTempLst: BuyOrderReqTemp[];

  public totalQty = 0;
  public totalAmount = 0;
  public totalItem = 0;
  public orderDate = new Date();

  public UserID: string | undefined;
  public ShopID: string | undefined;
  public reqName: string | undefined;
  //
  public PaymentTermID: number | undefined;
  public MaturityDaysID: number | undefined;
  public AggrementNO: string | undefined;
  public PartialDelivery = true;

  constructor(
    private http: HttpClient,
    private env: EnvService,
    private alertService: AlertService,
    private credentialsService: CredentialsService
  ) {
    this.SupplierInfo = new Supplier();
    this.SupplierList = [];
    this.ReqTempLst = [];
  }
  async UpdateRPUDeliveryDate(item: BuyOrderReqTemp) {
    if (!item.ischeck) {
      this.alertService.warning('Please select item first');
      this.GetTempDataByUser();
      return;
    }
    if (item.ischeck) {
      this.alertService.confirm('Are you sure to modify the data', () => {
        let promise = this.http
          .get(
            this.env.apiUrl +
              'RequisitionToPo/UpdateRPUDeliveryDate?barcode=' +
              item.BarCode +
              '&userid=' +
              this.UserID +
              '&rpu=' +
              item.CRPU +
              '&delDate=' +
              item.DeliveryDate
          )
          .toPromise();
        return promise
          .then((resp) => {
            return resp;
          })
          .catch((err) => {
            this.GetTempDataByUser();
            this.alertService.error(err.error);
          });
      });
    }
  }
  SelectedItem(item: BuyOrderReqTemp) {
    if (item.ischeck) {
      this.ReqTempLst.forEach((element) => {
        if (element.SupID == item.SupID) {
          element.ischeck = true;
          this.LoadSupplierInfo(item.SupID);
          element.enabled = false;
        } else {
          element.ischeck = false;
          element.enabled = true;
        }
      });
    }
    if (!item.ischeck) {
      let check = false;
      this.ReqTempLst.forEach((element) => {
        if (element.ischeck) {
          check = true;
        }
      });
      if (!check) {
        this.ReqTempLst.forEach((element) => {
          element.enabled = false;
        });
      }
    }
  }
  async LoadButtonClick() {
    if (this.reqName == null || this.reqName == undefined) {
      this.alertService.warning('Select requisition P/O');
      return;
    }
    let promise = this.http
      .get(
        this.env.apiUrl +
          'RequisitionToPo/LoadRequisition?UserID=' +
          this.UserID +
          '&shopID=' +
          this.ShopID +
          '&chlnn=' +
          this.reqName
      )
      .toPromise();
    return promise
      .then((resp) => {
        this.GetTempDataByUser();
        return resp;
      })
      .catch((err) => {
        this.alertService.warning(err.error);
      });
  }
  async ClearButtonClick() {
    let promise = this.http
      .get(this.env.apiUrl + 'RequisitionToPo/RemoveTmpRequisition?UserID=' + this.UserID)
      .toPromise();
    return promise
      .then((resp) => {
        this.ReqTempLst = [];
        this.totalQty = 0;
        this.totalAmount = 0;
        this.totalItem = 0;
        this.PaymentTermID = undefined;
        this.MaturityDaysID = undefined;
        this.AggrementNO = undefined;
        this.GetTempDataByUser();
        return resp;
      })
      .catch((err) => {
        this.alertService.warning(err.error);
      });
  }
  async GetTempDataByUser() {
    let promise = this.http
      .get(this.env.apiUrl + 'RequisitionToPo/GetTempDataByUser?userId=' + this.UserID)
      .toPromise();
    return promise.then((resp) => {
      this.ReqTempLst = resp as BuyOrderReqTemp[];
      if (this.ReqTempLst.length != 0) {
        this.reqName = this.ReqTempLst[0].Chln;
        this.totalItem = this.ReqTempLst.length;
        // this.LoadSupplierInfo(this.ReqTempLst[0].SupID)
        this.totalAmount = 0;
        this.ReqTempLst.forEach((element) => {
          element.DeliveryDate = this.formatCurrentDate(element.DeliveryDate);
          this.totalQty = this.totalQty + Number(element.Qty);
          this.totalAmount = this.totalAmount + Number(element.Qty) * Number(element.RPU);
        });
      }
      if (this.ReqTempLst.length == 0) {
        //this.alertService.warning("No data found");
        console.log('No data found in temp');
        return;
      }
      return this.ReqTempLst;
    });
  }

  async saveButtonClick() {
    let isSelected = false;
    var found = this.ReqTempLst.findIndex((itm) => {
      return itm.ischeck === true;
    });

    if (found > -1) {
      isSelected = true;
    }
    if (isSelected == false) {
      this.alertService.warning('No item selected');
      return;
    }
    if (this.ReqTempLst == null || this.ReqTempLst.length < 0) {
      this.alertService.warning('No data to save');
      return;
    }

    if (this.MaturityDaysID == null || this.MaturityDaysID == undefined) {
      this.alertService.warning('Please select maturity date');
      return;
    }
    if (this.PaymentTermID == null || this.PaymentTermID == undefined) {
      this.alertService.warning('Please select Payment Term ID');
      return;
    }
    if (this.PartialDelivery == false) {
      this.alertService.warning('Please select Partial Delivery');
      return;
    }

    this.ReqTempLst.forEach((element) => {
      element.PaymentTerms = String(this.PaymentTermID);
      element.MaturtyDays = String(this.MaturityDaysID);
      element.PartialDelivery = this.PartialDelivery;
      element.QutRefNo = this.AggrementNO;
      element.UserID = this.UserID;
    });

    this.alertService.confirm('Are you sure to save', () => {
      let promise = this.http
        .post(
          this.env.apiUrl + 'RequisitionToPo/SaveRequisitionToPO',
          this.ReqTempLst.filter((itm) => {
            return itm.ischeck === true;
          }),
          { responseType: 'text' }
        )
        .toPromise();
      return promise
        .then((result) => {
          this.alertService.success('P/O successfully done');
          this.GetTempDataByUser();
          this.reportAPICall(result, 'Supply Chain Copy');
          this.reportAPICall(result, 'Book Copy');
          this.reportAPICall(result, "Supplier's Copy");
          return result;
        })
        .catch((error) => {
          this.alertService.error(error.error);
        });
    });
  }

  supplierDDL() {
    this.http.get(this.env.apiUrl + 'api/Supplier').subscribe(
      (result) => {
        this.SupplierList = result as Supplier[];
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
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
  requisitionDDL() {
    this.http.get(this.env.apiUrl + 'RequisitionToPo/RequisitionToPo').subscribe(
      (result) => {
        this.RequisitionList = result as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  LoadSupplierInfo(supID: any) {
    this.SupplierInfo = this.SupplierList.find((a) => a.SupID == supID) as Supplier;

    if (this.SupplierInfo === null || this.SupplierInfo === undefined) {
      return;
    }
    if (this.SupplierInfo.chkAC) {
      this.PaymentTermID = 1;
    }
    if (this.SupplierInfo.chkPO) {
      this.PaymentTermID = 3;
    }
    if (this.SupplierInfo.chkCashCheq && this.SupplierInfo.chkCashCheq) {
      this.PaymentTermID = 2;
    }
    if (this.SupplierInfo.chkBEFTN && this.SupplierInfo.chkCashCheq) {
      this.PaymentTermID = 4;
    }
    if (this.SupplierInfo.MaturityDays) {
      this.MaturityDaysID = this.SupplierInfo.MaturityDays;
    }
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
  previewReport() {
    let dataList = this.ReqTempLst.filter((itm) => {
      return itm.ischeck === true;
    });
    if (dataList.length == 0) {
      return;
    }

    let barcodes = '';
    dataList.forEach((element) => {
      barcodes += "'" + element.BarCode + "',";
    });
    let bb = barcodes.substring(0, barcodes.length - 1);
    var url_ =
      this.env.reportUrl +
      'PurchaseOrder/PurchaseOrderReportPreview3?userId=' +
      this.UserID +
      '&matrutitydays=' +
      this.MaturityDaysID +
      '&partialDel=' +
      this.PartialDelivery +
      '&QutRefNo=' +
      this.AggrementNO +
      '&paymentTerms=' +
      this.PaymentTermID +
      '&barcodeList=' +
      bb +
      '&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  ngOnInit(): void {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.supplierDDL();
    this.requisitionDDL();
    this.GetTempDataByUser();
  }
}
