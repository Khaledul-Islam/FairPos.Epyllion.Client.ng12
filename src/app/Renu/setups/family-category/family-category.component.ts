import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { DataTablesResponse } from '@app/models/DataTablesResponse';
import { FamilyCategory } from '@app/models/FamilyCategory';
import { Result } from '@app/models/Result';
import { EnvService } from '@env/environment';

@Component({
  selector: 'app-family-category',
  templateUrl: './family-category.component.html',
  styleUrls: ['./family-category.component.scss'],
})
export class FamilyCategoryComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  public model: FamilyCategory;
  public dataList: FamilyCategory[] | undefined;
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
    this.model = new FamilyCategory();
  }

  deleteButtonClick() {
    this.alertService.confirm('are you sure you want to remove this data', () => {
      this.http.post<Result>(this.env.apiUrl + 'MemberCategory/Delete?Name=' + this.model.MemCatId, null).subscribe(
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

    var url: string = 'MemberCategory/Create';
    if (this.isUpdateMode) url = 'MemberCategory/Update';

    this.http.post<Result>(this.env.apiUrl + url, this.model).subscribe(
      (result) => {
        this.alertService.success('Data Saved Successfully');
        this.backButtonClick();
        if (this.isUpdateMode) {
          this.backButtonClick();
        }
        this.model = new FamilyCategory();
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
    this.model = new FamilyCategory();
  }

  backButtonClick() {
    this.isInsertMode = false;
    this.isUpdateMode = false;
    this.buttonText = 'Save';
  }

  editbuttonClick(id: any) {
    this.alertService.clear();
    this.isInsertMode = true;
    this.model = new FamilyCategory();
    this.buttonText = 'Update';
    this.isUpdateMode = true;
    this.http.get(this.env.apiUrl + 'MemberCategory/GetDetailsById?id=' + id).subscribe(
      (result) => {
        this.model = result as FamilyCategory;
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
          .post<DataTablesResponse>(this.env.apiUrl + 'MemberCategory/GetForDataTable', dataTablesParameters, {})
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
        { data: 'MemCatId' },
        { data: 'MemCatName' },
        { data: 'MinValue' },
        { data: 'MaxValue' },
        { defaultContent: '', data: 'Empty', orderable: false },
      ],
    };
  }
  ngOnInit(): void {
    this.loadAllUser();
  }
}
