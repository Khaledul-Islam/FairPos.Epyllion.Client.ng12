import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { DataTablesResponse } from '@app/models/DataTablesResponse';
import { Employee } from '@app/models/Employee';
import { Result } from '@app/models/Result';
import { EnvService } from '@env/environment';

@Component({
  selector: 'app-employee-sync',
  templateUrl: './employee-sync.component.html',
  styleUrls: ['./employee-sync.component.scss'],
})
export class EmployeeComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  public model: Employee;
  public dataList: Employee[] | undefined;
  public resultMaster: Result | undefined;
  public isInsertMode: boolean;
  public isUpdateMode: boolean;

  public buttonText: string;
  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private sanitizer: DomSanitizer,
    private credentinal: CredentialsService
  ) {
    this.isInsertMode = false;
    this.buttonText = 'Save';
    this.isUpdateMode = false;

    this.model = new Employee();
    this.dataList = [];
  }
  deleteButtonClick() {
    this.alertService.confirm('are you sure you want to remove this data', () => {
      this.http.post<Result>(this.env.apiUrl + 'Employee/Delete?Name=' + this.model.EmpID, null).subscribe(
        (result) => {
          this.alertService.success('Data Delete Successfully');
          this.backButtonClick();
        },
        (error) => {
          console.error(error);
          this.alertService.error(error.error);
        }
      );
    });
  }

  saveButtonClick() {
    this.alertService.clear();

    var url: string = 'Employee/Create';
    if (this.isUpdateMode) url = 'Employee/Update';

    this.http.post<Result>(this.env.apiUrl + url, this.model).subscribe(
      (result) => {
        this.alertService.success('Data Saved Successfully');

        if (this.isUpdateMode) {
          this.backButtonClick();
        }
        this.model = new Employee();
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }

  SyncButtonClick() {
    //debugger;
    this.http.post<string>(this.env.apiUrl + 'Employee/Sync/Employee_Sync', {}).subscribe(
      (response) => {
        this.alertService.success('Sync Done');
        this.loadAllUser();
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }

  backButtonClick() {
    this.isInsertMode = false;
    this.isUpdateMode = false;
    this.buttonText = 'Save';
  }

  // editbuttonClick(id: any) {

  //   this.alertService.clear();

  //   this.isInsertMode = true;
  //   this.model = new Employee();
  //   this.buttonText = 'Update';
  //   this.isUpdateMode = true;

  //   this.http.get<Result>(this.env.apiUrl + 'Employee/GetDetailsById/get_details_by_id?id=' + id).subscribe(result => {
  //     this.resultMaster = result;
  //     if (this.resultMaster.Status == true) {
  //       this.model = this.resultMaster.Data as Employee;
  //     }

  //   }, error => {
  //     console.error(error)
  //      this.alertService.error(error.error);
  //   });

  // }

  loadAllUser() {
    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            this.env.apiUrl + 'Employee/GetForDataTable/get_for_datatable',
            dataTablesParameters,
            {}
          )
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
        { data: 'EmpId' },
        { data: 'RFCardNo' },
        { data: 'Name' },
        { data: 'namebangla' },
        { data: 'Department' },
        { data: 'Email' },
        { data: 'StaffType' },
        { data: 'vDesignation' },
      ],
    };
  }

  ngOnInit(): void {
    this.loadAllUser();
  }
}
