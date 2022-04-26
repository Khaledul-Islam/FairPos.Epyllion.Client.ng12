import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';
import { Supplier } from '@app/models/Supplier';
import { BuyOrderReqTemp } from '@app/models/BuyOrderReqTemp';

@Component({
  selector: 'app-requisition-to-purchase-order-all',
  templateUrl: './requisition-to-purchase-order-all.component.html',
  styleUrls: ['./requisition-to-purchase-order-all.component.scss'],
})
export class RequisitionToPurchaseOrderAllComponent implements OnInit {
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
  public MonthList = [
    {
      Name: 'January',
      Value: 1,
    },
    {
      Name: 'February',
      Value: 2,
    },
    {
      Name: 'March',
      Value: 3,
    },
    {
      Name: 'April',
      Value: 4,
    },
    {
      Name: 'May',
      Value: 5,
    },
    {
      Name: 'June',
      Value: 6,
    },
    {
      Name: 'July',
      Value: 7,
    },
    {
      Name: 'August',
      Value: 8,
    },
    {
      Name: 'September',
      Value: 9,
    },
    {
      Name: 'October',
      Value: 10,
    },
    {
      Name: 'November',
      Value: 11,
    },
    {
      Name: 'December',
      Value: 12,
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
  public SupplierInfo: Supplier;
  public ReqTempLst: BuyOrderReqTemp[];

  public totalQty = 0;
  public totalAmount = 0;
  public totalItem = 0;
  public orderDate = new Date();

  public UserID: string | undefined;
  public ShopID: string | undefined;
  public monthName: string | undefined;
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
  async LoadButtonClick() {
    if (this.monthName == null || this.monthName == undefined) {
      this.alertService.warning('Select requisition Month');
      return;
    }
    if (this.SupplierInfo.SupID == null || this.SupplierInfo.SupID == undefined) {
      this.SupplierInfo.SupID = '';
    }
    let promise = this.http
      .get(
        this.env.apiUrl +
          'RequisitionToPo/LoadRequisitionAll?UserID=' +
          this.UserID +
          '&shopID=' +
          this.ShopID +
          '&month=' +
          this.monthName +
          '&supID=' +
          this.SupplierInfo.SupID
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
        //this.monthName = this.ReqTempLst[0].Chln;
        this.totalItem = this.ReqTempLst.length;
        //this.LoadSupplierInfo(this.ReqTempLst[0].SupID)
        this.totalAmount = 0;
        this.ReqTempLst.forEach((element) => {
          element.DeliveryDate = this.formatCurrentDate(element.DeliveryDate);
          this.totalQty = this.totalQty + Number(element.Qty);
          this.totalAmount = this.totalAmount + Number(element.Qty) * Number(element.RPU);
        });
      }
      if (this.ReqTempLst.length == 0) {
        this.alertService.warning('No data found');
        return;
      }
      return this.ReqTempLst;
    });
  }
  saveButtonClick() {}

  async supplierDDL() {
    let promise = this.http.get(this.env.apiUrl + 'api/Supplier').toPromise();
    return promise
      .then((result) => {
        return (this.SupplierList = result as Supplier[]);
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
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

  async LoadSupplierInfo(supID: any) {
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

  ngOnInit(): void {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.supplierDDL();
    this.GetTempDataByUser();
  }
}
