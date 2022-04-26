import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';
import { Supplier } from '@app/models/Supplier';
import { BuyOrderPriceApproval } from '@app/models/BuyOrderPriceApproval';

@Component({
  selector: 'app-requisition-to-po-approval',
  templateUrl: './requisition-to-po-approval.component.html',
  styleUrls: ['./requisition-to-po-approval.component.scss'],
})
export class RequisitionToPoApprovalComponent implements OnInit {
  public SupplierList: Supplier[];
  public TempPOList = [];
  public SupplierInfo: Supplier;
  public ReqTempLst: BuyOrderPriceApproval[];

  public totalQty = 0;
  public totalAmount = 0;
  public totalItem = 0;
  public orderDate = new Date();

  public UserID: string | undefined;
  public ShopID: string | undefined;
  public tempPoName: string | undefined;

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
  async UpdateRPUDeliveryDate(item: BuyOrderPriceApproval) {}

  async LoadButtonClick() {
    if (this.tempPoName == null || this.tempPoName == undefined) {
      this.alertService.warning('Select temp P/O');
      return;
    }
    let promise = this.http
      .get(this.env.apiUrl + 'RequisitionApproval/GetChallanDetails?tempPoNo=' + this.tempPoName)
      .toPromise();
    return promise
      .then((resp) => {
        this.ReqTempLst = resp as BuyOrderPriceApproval[];
        this.SupplierInfo.SupID = this.ReqTempLst[0].SupID;
        this.totalItem = this.ReqTempLst.length;
        this.ReqTempLst.forEach((element) => {
          element.EXPDT = this.formatCurrentDate(element.EXPDT);
          element.UserID = this.UserID;
          this.totalQty = this.totalQty + Number(element.Qty);
          this.totalAmount = this.totalAmount + Number(element.Qty) * Number(element.RPU);
        });
        return this.ReqTempLst;
      })
      .catch((err) => {
        this.alertService.warning(err.error);
      });
  }
  async ClearButtonClick() {
    this.alertService.confirm('Are you sure to clear data.', () => {
      this.tempPoName = undefined;
      this.SupplierInfo = new Supplier();
      this.SupplierList = [];
      this.ReqTempLst = [];
      this.supplierDDL();
      this.tempPODDL();
    });
  }

  async reportAPICall(idNo: string, header: string) {
    var url_ =
      this.env.reportUrl +
      'PurchaseOrder/PurchaseOrderChallanWise?challan_no=' +
      idNo +
      '&ReportType=' +
      header +
      '&SecretKey=1';
    window.open(url_, '_blank')?.focus();
  }

  async saveButtonClick() {
    if (this.ReqTempLst.length == 0) {
      this.alertService.warning('Temp PO not found');
      return;
    }
    this.alertService.confirm('Are you sure to save data.', () => {
      let promise = this.http
        .post(this.env.apiUrl + 'RequisitionApproval/saveBuyOrderPOApproval', this.ReqTempLst, { responseType: 'text' })
        .toPromise();
      return promise
        .then((resp) => {
          this.alertService.success('Data successfully saved');
          this.reportAPICall(resp, "Supplier's Copy");
          this.reportAPICall(resp, 'Supply Chain Copy');
          this.reportAPICall(resp, 'Book Copy');
          this.tempPoName = undefined;
          this.SupplierInfo = new Supplier();
          this.SupplierList = [];
          this.ReqTempLst = [];
          this.supplierDDL();
          this.tempPODDL();
          return resp;
        })
        .catch((error) => {
          this.alertService.warning(error.error);
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
  tempPODDL() {
    this.http.get(this.env.apiUrl + 'RequisitionApproval/TempPODDL').subscribe(
      (result) => {
        this.TempPOList = result as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  ngOnInit(): void {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.supplierDDL();
    this.tempPODDL();
  }
}
