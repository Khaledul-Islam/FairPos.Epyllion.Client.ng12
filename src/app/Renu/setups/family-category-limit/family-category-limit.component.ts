import { Component, OnInit } from '@angular/core';
import { DataTablesResponse } from '@app/models/DataTablesResponse';
import { FamilyCategory } from '@app/models/FamilyCategory';
import { MemberCategoryProduct } from '@app/models/MemberCategoryProduct';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';

@Component({
  selector: 'app-family-category-limit',
  templateUrl: './family-category-limit.component.html',
  styleUrls: ['./family-category-limit.component.scss'],
})
export class FamilyCategoryLimitComponent implements OnInit {
  public MemberCategoryList = [];
  dtOptions: DataTables.Settings = {};
  LstMemberCategoryProduct: MemberCategoryProduct[];
  public FamilyCategoryModel: FamilyCategory;
  public dataList: MemberCategoryProduct[];

  constructor(private http: HttpClient, private alertService: AlertService, private env: EnvService) {
    this.dataList = [];
    (this.LstMemberCategoryProduct = []), (this.FamilyCategoryModel = new FamilyCategory());
  }

  loadAllMemberItem() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      searching: false,
      paging: false,

      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(this.env.apiUrl + 'EmployeeProduct/GetForDataTable', dataTablesParameters, {})
          .subscribe((resp) => {
            that.dataList = resp.data as MemberCategoryProduct[];
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
  MemberCategoryDDL() {
    this.http.get(this.env.apiUrl + 'MemberCategory/GetAll').subscribe(
      (response) => {
        this.MemberCategoryList = response as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }

  MemberCategoryProductLoad(MemCatID: any) {
    this.dataList.forEach((element) => {
      element.Check = false;
      element.LimitQty = 0;
    });
    this.http.get(this.env.apiUrl + 'MemberCategoryProduct/FindByMemCatId?MemCatId=' + MemCatID).subscribe(
      (response) => {
        this.LstMemberCategoryProduct = response as MemberCategoryProduct[];
        this.dataList.forEach((dataListObj) => {
          dataListObj.MemCatId = this.FamilyCategoryModel.MemCatId;
        });
        this.dataList.forEach((element) => {
          this.LstMemberCategoryProduct.forEach((MemProduct) => {
            if (element.PrdID === MemProduct.PrdID) {
              element.Check = true;
              element.LimitQty = MemProduct.LimitQty;
              element.MemCatId = this.FamilyCategoryModel.MemCatId;
            }
          });
        });
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  MemberCategoryByID(MemCatID: any) {
    this.http.get(this.env.apiUrl + 'MemberCategory/GetDetailsById?id=' + MemCatID).subscribe(
      (response) => {
        this.FamilyCategoryModel = response as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  ngOnInit(): void {
    this.loadAllMemberItem();
    this.MemberCategoryDDL();
  }
  saveButtonClick() {
    this.http.post<MemberCategoryProduct>(this.env.apiUrl + 'MemberCategoryProduct/Update', this.dataList).subscribe(
      (result) => {
        this.alertService.success('Data saved Successfully');
        this.FamilyCategoryModel = new FamilyCategory();
        this.dataList.forEach((element) => {
          element.Check = false;
          element.LimitQty = 0;
          element.MemCatId = 0;
        });
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
}
