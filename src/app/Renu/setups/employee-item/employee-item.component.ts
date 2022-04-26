import { Component, OnInit } from '@angular/core';
import { DataTablesResponse } from '@app/models/DataTablesResponse';
import { Employee } from '@app/models/Employee';
import { EmployeeProduct } from '@app/models/EmployeeProduct';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';

@Component({
  selector: 'app-employee-item',
  templateUrl: './employee-item.component.html',
  styleUrls: ['./employee-item.component.scss'],
})
export class EmployeeItemComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  LstEmployeeProduct: EmployeeProduct[];
  public EmployeeModel: Employee;
  public dataList: EmployeeProduct[];

  constructor(private http: HttpClient, private alertService: AlertService, private env: EnvService) {
    this.EmployeeModel = new Employee();
    this.dataList = [];
    this.LstEmployeeProduct = [];
  }

  loadAllEmployeeItem() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      searching: false,
      paging: false,

      //
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(this.env.apiUrl + 'EmployeeProduct/GetForDataTable', dataTablesParameters, {})
          .subscribe((resp) => {
            that.dataList = resp.data as EmployeeProduct[];
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: 'PrdID', orderable: false },
        { data: 'ProductName', orderable: false },
        { defaultContent: '', data: 'Empty', orderable: false },
      ],
    };
  }
  EmployeeLoad(EmpID: any) {
    this.dataList.forEach((element) => {
      element.Check = false;
      element.LimitQty = 0;
    });
    this.http.get(this.env.apiUrl + 'EmployeeProduct/GetEmployee?cusID=' + EmpID).subscribe(
      (response) => {
        this.EmployeeModel = response as Employee;
        this.LstEmployeeProduct = this.EmployeeModel.LstEmployeeProduct as any;

        this.dataList.forEach((dataListObj) => {
          dataListObj.EmpID = this.EmployeeModel.EmpID;
        });
        this.dataList.forEach((element) => {
          this.LstEmployeeProduct.forEach((empProduct) => {
            if (element.PrdID === empProduct.PrdID) {
              element.Check = true;
              element.LimitQty = empProduct.LimitQty;
              element.EmpID = this.EmployeeModel.EmpID;
            }
          });
        });
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  ngOnInit(): void {
    this.loadAllEmployeeItem();
  }
  saveButtonClick() {
    this.http.post<EmployeeProduct>(this.env.apiUrl + 'EmployeeProduct/Update', this.dataList).subscribe(
      (result) => {
        this.alertService.success('Data saved Successfully');
        this.EmployeeModel = new Employee();
        this.dataList.forEach((element) => {
          element.Check = false;
          element.LimitQty = 0;
          element.EmpID = 0;
        });
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  backButtonClick() {
    this.dataList = [];
  }
  deleteButtonClick() {}
}
