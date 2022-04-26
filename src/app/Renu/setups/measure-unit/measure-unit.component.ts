import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { DataTablesResponse } from '@app/models/DataTablesResponse';
import { MeasureUnit } from '@app/models/MeasureUnit';
import { Result } from '@app/models/Result';
import { EnvService } from '@env/environment';

@Component({
  selector: 'app-measure-unit',
  templateUrl: './measure-unit.component.html',
  styleUrls: ['./measure-unit.component.scss'],
})
export class MeasureUnitComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  public model: MeasureUnit;
  public dataList: MeasureUnit[] | undefined;
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
    this.model = new MeasureUnit();
  }
  deleteButtonClick() {
    this.alertService.confirm('are you sure you want to remove this data', () => {
      this.http.post<Result>(this.env.apiUrl + 'MeasureUnit/Delete?Name=' + this.model.UOMId, null).subscribe(
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

    var url: string = 'MeasureUnit/Create';
    if (this.isUpdateMode) url = 'MeasureUnit/Update';

    this.http.post<Result>(this.env.apiUrl + url, this.model).subscribe(
      (result) => {
        this.alertService.success('Data Saved Successfully');
        if (this.isUpdateMode) {
          this.backButtonClick();
        }
        this.model = new MeasureUnit();
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }

  createButtonClick() {
    this.isInsertMode = true;
    this.isUpdateMode = false;
    this.buttonText = 'Save';
    this.model = new MeasureUnit();
  }

  backButtonClick() {
    this.isInsertMode = false;
    this.isUpdateMode = false;
    this.buttonText = 'Save';
  }

  editbuttonClick(id: any) {
    debugger;
    this.alertService.clear();

    this.isInsertMode = true;
    this.model = new MeasureUnit();
    this.buttonText = 'Update';
    this.isUpdateMode = true;
    this.http.get(this.env.apiUrl + 'MeasureUnit/GetDetailsById?id=' + id).subscribe(
      (result) => {
        this.model = result as MeasureUnit;
      },
      (error) => {
        console.error(error);
        this.alertService.error(error.error);
      }
    );
  }

  loadAllUser() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(this.env.apiUrl + 'MeasureUnit/GetForDataTable', dataTablesParameters, {})
          .subscribe((resp) => {
            that.dataList = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [{ data: 'UOMId' }, { data: 'UOMName' }, { defaultContent: '', data: 'Empty', orderable: false }],
    };
  }
  ngOnInit(): void {
    this.loadAllUser();
  }
}
