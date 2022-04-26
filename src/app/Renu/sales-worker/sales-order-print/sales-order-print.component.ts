import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { Employee } from '@app/models/Employee';
import { Product } from '@app/models/Product';
import { EnvService } from '@env/environment';
import { CredentialsService } from '@app/auth';
import { SalesOrder } from '@app/models/SalesOrder';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { VerifyItemComponent } from './verify-item/verify-item.component';

@Component({
  selector: 'app-sales-order-print',
  templateUrl: './sales-order-print.component.html',
  styleUrls: ['./sales-order-print.component.scss'],
})
export class SalesOrderPrintComponent implements OnInit {
  public stockType = 'Worker Stock';
  public CounterID: string | undefined;
  public UserID: string | undefined;
  public SO_NO: string | undefined;
  public pendingSO = [];
  public totalprice = 0.0;

  employee: Employee = new Employee();
  public orderDetailsList: SalesOrder[];
  public ProductList: Product[];
  public isPrint = true;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: any;
  @ViewChild(VerifyItemComponent) childItemComponent: any;

  constructor(
    private http: HttpClient,
    private env: EnvService,
    private alertService: AlertService,
    private credentialsService: CredentialsService
  ) {
    this.ProductList = [];
    this.orderDetailsList = [];
  }
  receiveItemSelection(item: any) {
    this.GetPendingSalesOrder();
    this.orderDetailsList = [];
    this.employee = new Employee();
  }
  verifyItem() {
    if (this.employee.Name == null || this.employee.Name == undefined) {
      this.alertService.warning('Please Select Sales Order First');
      return;
    }
    if (this.isPrint) {
      var url_ =
        this.env.reportUrl +
        'Sale/SOChallan?UserId=' +
        this.SO_NO +
        '&ReportType=Print Sales Order(Worker)&IsTemp=false&SecretKey=' +
        this.env.secrectKey;
      window.open(url_, '_blank')?.focus();
    }
    this.childItemComponent.clickFromParent(this.orderDetailsList.length, this.orderDetailsList, this.SO_NO);
  }

  ngOnInit(): void {
    this.UserID = this.credentialsService.credentials?.username;
    this.GetPendingSalesOrder();
  }

  async GetPendingSalesOrder() {
    let promise = this.http.get(this.env.apiUrl + 'SalesOrderPrint/PendingSalesOrder').toPromise();
    return promise.then((resp) => {
      return (this.pendingSO = resp as any);
    });
  }
  async GetEmployeeById(empID: any) {
    let promise = this.http.get(this.env.apiUrl + 'SalesWorker/GetEmployeeById?empId=' + empID).toPromise();
    return promise.then((resp) => {
      return (this.employee = resp as Employee);
    });
  }
  async GetOrderDetails(so_no: any) {
    this.totalprice = 0.0;
    this.SO_NO = so_no;
    let promise = this.http.get(this.env.apiUrl + 'SalesOrder/GetOrderDetails?so_no=' + so_no).toPromise();
    return promise.then((resp) => {
      this.orderDetailsList = resp as SalesOrder[];
      if (this.orderDetailsList.length > 0) {
        this.GetEmployeeById(this.orderDetailsList[0].EmpID);
        this.orderDetailsList.forEach((element) => {
          this.totalprice += Number(element.TOTAL_AMT);
        });
      }
      return this.orderDetailsList;
    });
  }
}
