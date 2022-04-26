import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { DataTablesResponse } from '@app/models/DataTablesResponse';
import { Result } from '@app/models/Result';
import { ShopList } from '@app/models/ShopList';
import { EnvService } from '@env/environment';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss'],
})
export class ShopListComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  public model: ShopList;
  public dataList: ShopList[] | undefined;

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

    this.model = new ShopList();
  }

  saveButtonClick() {
    this.alertService.clear();

    //this.userServer.userImages = new UserImage();

    var url: string = 'api/ShopList/create';
    if (this.isUpdateMode) url = 'api/ShopList/update';

    this.http.post<Result>(this.env.apiUrl + url, this.model).subscribe(
      (result) => {
        // this.designationList = JSON.parse(this.resultMaster.Data);
        this.alertService.success('Data Saved Successfully');

        if (this.isUpdateMode) {
          this.backButtonClick();
        }
        this.model = new ShopList();
        //this.userServer.userImages =new UserImage();
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );

    //this.isInsertMode = false;
  }

  createButtonClick() {
    this.isInsertMode = true;
    this.isUpdateMode = false;
    this.buttonText = 'Save';
    this.model = new ShopList();
  }

  backButtonClick() {
    this.isInsertMode = false;
    this.isUpdateMode = false;
    this.buttonText = 'Save';
  }

  editbuttonClick(id: any) {
    this.alertService.clear();

    this.isInsertMode = true;
    this.model = new ShopList();
    this.buttonText = 'Update';
    this.isUpdateMode = true;

    this.http.get<Result>(this.env.apiUrl + 'api/ShopList/get_details_by_id?id=' + id).subscribe(
      (result) => {
        this.resultMaster = result;
        if (this.resultMaster.Status == true) {
          // this.designationList = JSON.parse(this.resultMaster.Data);
          this.model = this.resultMaster.Data as ShopList;

          // if(!this.userServer.userImages){
          //   this.userServer.userImages =new UserImage();
          // }
          // if(this.userServer.userImages.NIDImageData){
          //   this.nidImageData = this.userServer.userImages.NIDImageData;
          // }
          // if(this.userServer.userImages.NIDImageData2){
          //   this.nidImageData2 = this.userServer.userImages.NIDImageData2;
          // }

          // if(this.userServer.userImages.UserImageData){
          //   this.userImageData = this.userServer.userImages.UserImageData;
          // }

          // for (var i = 0; i < this.designationList.length; i++) {
          //   if (this.designationList[i].DES_ID == this.userServer.DES_ID) {
          //     this.userServer.DES_ID_Selected = this.designationList[i];
          //   }
          // }
        }
      },
      (error) => {
        console.error(error);
        this.alertService.error(error.error);
      }
    );
  }

  loadAllUser() {
    const that = this;

    //this._http.get<Result>(this._baseUrl + 'api/setup/User_SelectAll_Grid').subscribe(result => {
    //  this.resultMaster = result;
    //  if (this.resultMaster.Status == true) {

    //    // this.designationList = JSON.parse(this.resultMaster.Data);
    //    this.userList = this.resultMaster.Data as User[];

    //  }

    //}, error => console.error(error));

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            //'https://angular-datatables-demo-server.herokuapp.com/',
            this.env.apiUrl + 'api/ShopList/get_for_datatable',
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
        { data: 'ShopID' },
        { data: 'ShopName' },
        { data: 'VillAreaRoad' },
        { data: 'Post' },
        { data: 'Contact' },
        { data: 'Phone' },
        { data: 'VatRegNo' },
        { defaultContent: '', data: 'Empty', orderable: false },
      ],
    };
  }

  ngOnInit(): void {
    this.loadAllUser();
  }
}
