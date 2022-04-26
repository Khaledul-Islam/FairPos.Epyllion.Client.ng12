import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';
import { Employee } from '@app/models/Employee';
import { GlobalSetup } from '@app/models/GlobalSetup';
import { TopUp } from '@app/models/TopUp';

@Component({
  selector: 'app-topup-management-staff',
  templateUrl: './topup-management-staff.component.html',
  styleUrls: ['./topup-management-staff.component.scss'],
})
export class TopupManagementStaffComponent implements OnInit {
  public UserID: string | undefined;
  public ShopID: string | undefined;
  public desc: string | undefined;
  public topup: number | undefined;
  public topup2: number | undefined;
  public CounterID: string | undefined;
  public Employee: Employee;
  public globalSetup: GlobalSetup;
  public topUpStaff: TopUp = new TopUp();

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {
    this.Employee = new Employee();
    this.globalSetup = new GlobalSetup();
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
      return;
    }
    if (this.Employee.IsActive == false) {
      this.alertService.warning('Sorry , this employee is inactive');
      return;
    }
    if (this.Employee.StaffType != 'Management Staff') {
      this.alertService.warning('Only Management Staff Allowed Here');
      return;
    }
  }
  cancelButton() {
    this.Employee = new Employee();
    this.desc = undefined;
    this.topup = undefined;
    this.topup2 = undefined;
  }
  async GetSoftwareSetting() {
    let promise = this.http.get(this.env.apiUrl + 'api/ShopList/GetSoftwareSetting?storeID=' + this.ShopID).toPromise();
    return promise
      .then((resp) => {
        return (this.globalSetup = resp as GlobalSetup);
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  async saveAPICall() {
    this.alertService.confirm('are you sure you want to remove this data', () => {
      let promise = this.http.post<TopUp>(this.env.apiUrl + 'SalesStaff/saveTopUp', this.topUpStaff).toPromise();
      return promise.then((resp) => {
        this.alertService.success('Saved successfull');
        this.cancelButton();
        return resp;
      });
    });
  }
  async saveButton() {
    if (this.Employee.RFCardNo == null || this.Employee.RFCardNo == undefined) {
      this.alertService.warning('No Employee is selected . Please insert an employee RFID');
      return;
    }
    if (this.Employee.EmpID == null || this.Employee.EmpID == undefined) {
      this.alertService.warning('No Employee is selected . Please insert an employee ID');
      return;
    }
    if (this.topup != this.topup2) {
      this.alertService.warning('Amount miss match');
      return;
    }
    if (
      Number(this.topup) < Number(this.globalSetup.MinTopup) ||
      Number(this.topup) + Number(this.topup) > Number(this.globalSetup.MaxTopup)
    ) {
      this.alertService.warning(
        'Enter an amount between ' + this.globalSetup.MinTopup + ' and ' + this.globalSetup.MaxTopup
      );
      return;
    }
    this.topUpStaff.EmpID = this.Employee.EmpID;
    this.topUpStaff.RFCardNo = this.Employee.RFCardNo;
    this.topUpStaff.Name = this.Employee.Name;
    this.topUpStaff.Balance = this.Employee.Balance;
    this.topUpStaff.desc = this.desc;
    this.topUpStaff.topup = this.topup;
    this.topUpStaff.topup2 = this.topup2;
    this.topUpStaff.UserId = this.UserID;
    await this.saveAPICall();
  }

  async ngOnInit(): Promise<void> {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.GetSoftwareSetting();
  }
}
