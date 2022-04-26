import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { Employee } from '@app/models/Employee';
import { SalesOrder } from '@app/models/SalesOrder';
import { EnvService } from '@env/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sales-order-delivery-staff',
  templateUrl: './sales-order-delivery-staff.component.html',
  styleUrls: ['./sales-order-delivery-staff.component.scss'],
})
export class SalesOrderDeliveryStaffComponent implements OnInit {
  public stockType = 'Staff Stock';
  public UserID: string | undefined;
  public ShopID: string | undefined;
  public CounterID: string | undefined;
  public counterName: string | undefined;
  public so_no: string | undefined;
  public totalPrice: number | undefined;
  public Employee: Employee;
  public orderList: SalesOrder[];
  public orderDetailsList: SalesOrder[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: any;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {
    this.Employee = new Employee();
    this.orderList = [];
    this.orderDetailsList = [];
  }

  async SalesOrderClick() {
    await this.GetPendingItemsByEmp(this.Employee.EmpID);
    if (this.orderList.length == 0) {
      this.alertService.warning('SO No not found / already deliverd / invalid SO NO');
      return;
    }
    await this.GetOrderDetails(this.so_no);
  }
  async GetOrderDetails(so_no: any) {
    let promise = this.http.get(this.env.apiUrl + 'SalesOrder/GetOrderDetails?so_no=' + so_no).toPromise();
    return promise.then((resp) => {
      this.orderDetailsList = resp as SalesOrder[];
      this.totalPrice = this.orderDetailsList[0].NET_AMT;
      return this.orderDetailsList;
    });
  }
  async GetPendingItemsByEmp(empid: any) {
    let promise = this.http
      .get(this.env.apiUrl + 'SalesOrder/GetPendingItemsByEmp?empId=' + empid + '&isAccApproved=true')
      .toPromise();
    return promise.then((resp) => {
      this.orderList = resp as SalesOrder[];
      return this.orderList.find((p) => p.SO_NO == this.so_no && p.SalesStockType == 'Staff Stock');
    });
  }
  async GetEmployeeByRFId() {
    let promise = this.http
      .get(this.env.apiUrl + 'SalesWorker/GetEmployeeByRFId?rfid=' + this.Employee.RFCardNo)
      .toPromise();
    return promise.then((resp) => {
      return (this.Employee = resp as Employee);
    });
  }

  async GetEmployeeDetails() {
    let d = await this.GetEmployeeByRFId();
    if (d == null || d == undefined) {
      this.alertService.warning('Employee not found , invlaid RF Card');
      this.Employee = new Employee();
      return;
    }
    if (this.Employee.IsActive == false) {
      this.alertService.warning('Sorry , this employee is inactive');
      this.Employee = new Employee();
      return;
    }
    if (this.Employee.StaffType == 'Worker Staff') {
      this.alertService.warning('Worker order is not allowed here');
      this.Employee = new Employee();
      return;
    }
    if (this.Employee.StaffType != 'Management Staff') {
      this.alertService.warning('worker/non management staff order is not allowed here');
      this.Employee = new Employee();
      return;
    }
    // let e = await this.GetTempSalesOrder();
    // if (e != null || e != undefined) {
    //   this.alertService.warning("Another Counter (" + this.TempSalesOrder.CounterId + ") already processing this Employee data");
    //   return;
    // }
    // await this.GetInvoiceByEmployee();
  }
  async submitButtonClick() {
    if (this.Employee.RFCardNo == null || this.Employee.RFCardNo == undefined) {
      this.alertService.warning('Scan RFID');
      return;
    }
    if (this.so_no == null || this.so_no == undefined) {
      this.alertService.warning('Scan SO NO');
      return;
    }
    if (this.orderList.length == 0) {
      this.alertService.warning('SO No not found / already deliverd / invalid SO NO');
      return;
    }
    if (this.orderDetailsList[0].IS_APPROVED == true || this.orderDetailsList[0].IsCanceld == true) {
      this.alertService.warning('This order already processed by another user');
      return;
    }
    await this.SaveAPICall();
  }
  async reportAPICall(idNo: string, header: string) {
    var url_ =
      this.env.reportUrl + 'Sale/SalesInvoice?InvoiceNo=' + idNo + '&Reprint=""&SecretKey=' + this.env.secrectKey;
    window.open(url_, '_blank')?.focus();
  }
  async SaveAPICall() {
    this.orderDetailsList.forEach((element) => {
      element.CREATE_BY = this.UserID;
      element.CounterId = this.CounterID;
      element.ShopId = this.ShopID;
      element.CounterName = this.counterName;
    });
    let promise = this.http
      .post(this.env.apiUrl + 'SalesOrderPrint/SalesOrderDeliverySaveStaff', this.orderDetailsList, {
        responseType: 'text',
      })
      .toPromise();
    return promise
      .then((resp) => {
        this.Employee = new Employee();
        this.orderList = [];
        this.orderDetailsList = [];
        this.reportAPICall(resp, '==');
        return resp;
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  async ngOnInit(): Promise<void> {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.CounterID = String(this.credentialsService.credentials?.CounterId);
    this.counterName = this.credentialsService.credentials?.username;
    if (this.CounterID === null || this.CounterID === undefined) {
      this.alertService.warning('Please set counter id');
      return;
    }
  }
}
