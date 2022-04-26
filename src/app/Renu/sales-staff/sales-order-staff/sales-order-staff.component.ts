import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';
import { Employee } from '@app/models/Employee';
import { TempSalesOrder } from '@app/models/TempSalesOrder';
import { Invoice } from '@app/models/Invoice';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SalesModalWStaffComponent } from './sales-modal-w-staff/sales-modal-w-staff.component';
import { GlobalSetup } from '@app/models/GlobalSetup';

@Component({
  selector: 'app-sales-order-staff',
  templateUrl: './sales-order-staff.component.html',
  styleUrls: ['./sales-order-staff.component.scss'],
})
export class SalesOrderStaffComponent implements OnInit {
  public stockType = 'Staff Stock';
  public UserID: string | undefined;
  public ShopID: string | undefined;
  public CounterID: string | undefined;
  public softwareSetting: GlobalSetup;
  public Employee: Employee;
  public TempSalesOrder: TempSalesOrder;
  public TempSalesOrderList: TempSalesOrder[];
  public InvoiceList: Invoice[];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: any;
  @ViewChild(SalesModalWStaffComponent) childItemComponent: any;
  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {
    this.softwareSetting = new GlobalSetup();
    this.Employee = new Employee();
    this.TempSalesOrder = new TempSalesOrder();
    this.TempSalesOrderList = [];
    this.InvoiceList = [];
  }
  async GetSoftwareSetting() {
    let promise = this.http.get(this.env.apiUrl + 'api/ShopList/GetSoftwareSetting?storeID=' + this.ShopID).toPromise();
    return promise
      .then((resp) => {
        this.softwareSetting = resp as GlobalSetup;
        console.log(this.softwareSetting);
        // this.softwareSetting.BW_TODATE = this.formatCurrentDate(this.softwareSetting.BW_TODATE) as any;
        // this.softwareSetting.BW_FROMDATE = this.formatCurrentDate(this.softwareSetting.BW_FROMDATE) as any;
        // this.softwareSetting.NMS_FROMDATE = this.formatCurrentDate(this.softwareSetting.NMS_FROMDATE) as any;
        // this.softwareSetting.NMS_TODATE = this.formatCurrentDate(this.softwareSetting.NMS_TODATE) as any;
        // this.softwareSetting.REQ_FROMDATE = this.formatCurrentDate(this.softwareSetting.REQ_FROMDATE) as any;
        // this.softwareSetting.REQ_TODATE = this.formatCurrentDate(this.softwareSetting.REQ_TODATE) as any;
        return this.softwareSetting;
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  async GetTempSalesOrderList() {
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
      return this.TempSalesOrderList;
    });
  }
  async GetTempSalesOrder() {
    let promise = this.http
      .get(
        this.env.apiUrl +
          'SalesWorker/TempSalesOrder?UserId=' +
          this.UserID +
          '&CounterId=' +
          this.CounterID +
          '&stocktype=' +
          this.stockType
      )
      .toPromise();
    return promise.then((resp) => {
      return (this.TempSalesOrder = resp as TempSalesOrder);
    });
  }
  async GetEmployeeById() {
    let promise = this.http
      .get(this.env.apiUrl + 'SalesWorker/GetEmployeeById?empId=' + this.TempSalesOrderList[0].EmpID)
      .toPromise();
    return promise.then((resp) => {
      return (this.Employee = resp as Employee);
    });
  }
  async GetEmployeeByRFId() {
    if (this.Employee.RFCardNo == null || this.Employee.RFCardNo == undefined) {
      this.alertService.warning('RFID not valid');
      return;
    }
    let promise = this.http
      .get(this.env.apiUrl + 'SalesWorker/GetEmployeeByRFId?rfid=' + this.Employee.RFCardNo)
      .toPromise();
    return promise.then((resp) => {
      return (this.Employee = resp as Employee);
    });
  }
  async GetInvoiceByEmployee() {
    let promise = this.http
      .get(this.env.apiUrl + 'SalesWorker/GetInvoiceByEmployee?empId=' + this.Employee.EmpID)
      .toPromise();
    return promise.then((resp) => {
      return (this.InvoiceList = resp as Invoice[]);
    });
  }
  async GetEmployeeDetails() {
    if (this.softwareSetting.IS_BLOCK_NONMGMSTAFF) {
      var currentDate = new Date().toJSON().slice(0, 10);
      var from = new Date(this.softwareSetting.NMS_FROMDATE as any);
      var to = new Date(this.softwareSetting.NMS_TODATE as any);
      var check = new Date(currentDate);
      const month = check.toLocaleString('default', { month: 'long' });
      if (check.getDate() >= from.getDate() && check.getDate() <= to.getDate()) {
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
        if (this.Employee.StaffType != 'Management Staff') {
          this.alertService.warning('worker/non management staff order is not allowed here');
          this.Employee = new Employee();
          return;
        }
        let e = await this.GetTempSalesOrder();
        if (e != null || e != undefined) {
          this.alertService.warning(
            'Another Counter (' + this.TempSalesOrder.CounterId + ') already processing this Employee data'
          );
          this.Employee = new Employee();
          return;
        }
        await this.GetInvoiceByEmployee();
      } else {
        this.alertService.error(
          'Sales blocked by Administrator.</br> Allowed date range</br> FROM : ' +
            month +
            ' ' +
            from.getDate() +
            '</br>  TO : ' +
            month +
            ' ' +
            to.getDate()
        );
        return;
      }
    }
    if (this.softwareSetting.IS_BLOCK_NONMGMSTAFF == false) {
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
      if (this.Employee.StaffType != 'Management Staff') {
        this.alertService.warning('worker/non management staff order is not allowed here');
        this.Employee = new Employee();
        return;
      }
      let e = await this.GetTempSalesOrder();
      if (e != null || e != undefined) {
        this.alertService.warning(
          'Another Counter (' + this.TempSalesOrder.CounterId + ') already processing this Employee data'
        );
        this.Employee = new Employee();
        return;
      }
      await this.GetInvoiceByEmployee();
    }
  }
  cancelClick() {
    this.Employee = new Employee();
  }
  proceesSaleClick() {
    if (this.Employee.RFCardNo == null || this.Employee.RFCardNo == undefined) {
      this.alertService.warning('No Employee is selected . Please insert an employee RFID');
      return;
    }
    if (this.Employee.EmpID == null || this.Employee.EmpID == undefined) {
      this.alertService.warning('No Employee is selected . Please insert an employee ID');
      return;
    }
    if (Number(this.Employee.CreditLimit) <= 0) {
      this.alertService.warning('Credit limit exceeded');
      return;
    }
    if (Number(this.Employee.AvailableLimit) <= 0) {
      this.alertService.warning('Available limit exceeded');
      return;
    }
    this.childItemComponent.clickFromParent(this.Employee.EmpID);
  }
  receiveItemSelection(item: any) {
    this.Employee = new Employee();
  }
  async ngOnInit(): Promise<void> {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.CounterID = String(this.credentialsService.credentials?.CounterId);
    this.GetSoftwareSetting();
    if (this.CounterID === null || this.CounterID === undefined) {
      this.alertService.warning('Please set counter id');
      return;
    }
    await this.GetTempSalesOrderList();
    if (this.TempSalesOrderList.length > 0) {
      await this.GetEmployeeById();
      await this.GetInvoiceByEmployee();
    }
  }
}
