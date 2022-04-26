import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { Employee } from '@app/models/Employee';
import { Product } from '@app/models/Product';
import { Buy } from '@app/models/Buy';
import { EnvService } from '@env/environment';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CredentialsService } from '@app/auth';
import { TempSalesOrder } from '@app/models/TempSalesOrder';

@Component({
  selector: 'app-sales-modal-w-staff',
  templateUrl: './sales-modal-w-staff.component.html',
  styleUrls: ['./sales-modal-w-staff.component.scss'],
})
export class SalesModalWStaffComponent implements OnInit {
  public stockType = 'Staff Stock';
  public CounterID: string | undefined;

  public empid: string | undefined;
  public totalprice = 0;
  public UserID: string | undefined;
  public ShopID: string | undefined;
  private modalReference: any;
  public childitemflag: boolean = true;
  employee: Employee = new Employee();
  public ProductList: Product[];
  public buyList: Buy[];
  public buyListGroup: Buy[];
  public TempSalesOrderList: TempSalesOrder[];

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private env: EnvService,
    private alertService: AlertService,
    private credentialsService: CredentialsService
  ) {
    this.ProductList = [];
    this.buyList = [];
    this.buyListGroup = [];
    this.TempSalesOrderList = [];
  }

  ngOnInit(): void {}
  async SaveSalesOrder() {
    this.TempSalesOrderList.forEach((element) => {
      element.GrandTotal = this.totalprice;
      element.AvailableLimit = this.employee.AvailableLimit;
    });

    if (Number(this.employee.CreditLimit) <= this.totalprice) {
      this.alertService.warning('Credit limit Exceeded');
      return;
    }
    let promise = this.http
      .post(this.env.apiUrl + 'SalesStaff/SalesOrderSave', this.TempSalesOrderList, { responseType: 'text' })
      .toPromise();
    return promise
      .then((resp) => {
        this.modalReference.close();
        this.alertService.success('Order successfull');
        this.showReport(resp);
        this.SelectEvent.emit('ff' as any);
      })
      .catch((err) => {
        this.modalReference.close();
        this.alertService.error(err.error);
      });
  }
  async GetTempSalesOrderList() {
    this.totalprice = 0;
    let promise = this.http
      .get(
        this.env.apiUrl +
          'SalesWorker/TempSalesOrderList?UserId=' +
          this.UserID +
          '&CounterId=' +
          this.CounterID +
          '&stocktype=' +
          this.stockType
      )
      .toPromise();
    return promise.then((resp) => {
      this.TempSalesOrderList = resp as TempSalesOrder[];
      if (this.TempSalesOrderList.length > 0) {
        this.TempSalesOrderList.forEach((element) => {
          element.TotalAmnt = Number(element.QTY) * Number(element.RPU);
          this.totalprice += Number(element.TotalAmnt);
        });
      }
      return this.TempSalesOrderList;
    });
  }
  async TempSalesOrderSave(buy: Buy) {
    buy.EmpID = this.employee.EmpID;
    buy.SpouseId = this.employee.SpouseId;
    buy.UserID = this.UserID;
    buy.ShopID = this.ShopID;
    buy.CounterID = this.CounterID;

    if (Number(this.employee.CreditLimit) <= this.totalprice) {
      this.alertService.warning('Credit limit Exceeded');
      return;
    }
    let promise = this.http.post(this.env.apiUrl + 'SalesStaff/TempSalesOrderSave', buy).toPromise();
    return promise
      .then((resp) => {
        this.GetTempSalesOrderList();
        return resp;
      })
      .catch((err) => {
        console.clear();
        this.alertService.error(err.error);
      });
  }
  PreviewButtonClick() {
    var url_ =
      this.env.reportUrl +
      'Sale/SOChallan?UserId=' +
      this.UserID +
      '&ReportType=Preview Sales Order(Worker)&IsTemp=true&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  showReport(sono: string) {
    var url_ =
      this.env.reportUrl +
      'Sale/SOChallan?UserId=' +
      sono +
      '&ReportType=Sales Order(Worker)&IsTemp=false&SecretKey=' +
      this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  async onModalOpen() {
    this.UserID = this.credentialsService.credentials?.username;
    this.CounterID = String(this.credentialsService.credentials?.CounterId);
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    await this.GetEmployeeById();
    await this.GetProductList();
    await this.GetTempSalesOrderList();
  }
  @Output() SelectEvent = new EventEmitter<object>();

  backModalClick() {
    this.childitemflag = true;
  }

  close(content: any) {
    //close btn execute
    this.modalReference.close();
  }

  async clickFromParent(_empid: string) {
    // 1st execute
    this.empid = _empid;
    this.onModalOpen();
    setTimeout(() => {
      let element: HTMLElement = document.getElementById('btnLoadItemlist') as HTMLElement;
      element.click();
    }, 1);
  }
  async selectProduct(ID: any) {
    this.buyList = [];
    await this.GetProductsByProductID(ID);
    if (this.buyList.length <= 0) {
      this.alertService.warning('No Product Found');
    }
  }
  async deleteButtonClick(item: TempSalesOrder) {
    this.alertService.confirm('are you sure you want to delete this data', async () => {
      let promise = this.http.post(this.env.apiUrl + 'SalesWorker/TempSalesOrderDelete', item).toPromise();
      return promise
        .then((resp) => {
          this.alertService.success(item.ItemName + ' Removed from list');
          this.GetTempSalesOrderList();
        })
        .catch((error) => {
          this.alertService.success(error.error);
        });
    });
  }
  async GetEmployeeById() {
    let promise = this.http.get(this.env.apiUrl + 'SalesWorker/GetEmployeeById?empId=' + this.empid).toPromise();
    return promise.then((resp) => {
      return (this.employee = resp as Employee);
    });
  }
  async GetProductsByProductID(prdId: any) {
    let promise = this.http.get(this.env.apiUrl + 'SalesStaff/GetProductsByProductID?PrdId=' + prdId).toPromise();
    return promise.then((resp) => {
      this.buyList = resp as Buy[];
      return this.buyList.find((item) => item.ShopID === this.ShopID);
    });
  }
  async GetProductList() {
    let promise = this.http.get(this.env.apiUrl + 'api/Product').toPromise();
    return promise.then((resp) => {
      return (this.ProductList = resp as Product[]);
    });
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
    this.SelectEvent.emit(item);
    this.modalReference.close();
  }
}
