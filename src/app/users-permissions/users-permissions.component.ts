import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { Result } from '@app/models/Result';
import { UsersWeb } from '@app/models/UsersWeb';
import { WebMenu } from '@app/models/WebMenu';
import { EnvService } from '@env/environment';

@Component({
  selector: 'app-users-permissions',
  templateUrl: './users-permissions.component.html',
  styleUrls: ['./users-permissions.component.scss'],
})
export class UsersPermissionsComponent implements OnInit {
  public resultMaster: Result;

  public model: WebMenu;
  public UserName: string;
  // public _userType: string;

  public ParentmenuList: WebMenu[];
  public ChildmenuList: WebMenu[];

  public userList: UsersWeb[];

  private selectStatus: boolean;

  constructor(private http: HttpClient, private alertService: AlertService, private env: EnvService) {
    this.model = new WebMenu();
    this.UserName = '';
    //  this._userType = '';

    this.ParentmenuList = [];
    this.ChildmenuList = [];
    this.userList = [];
    this.selectStatus = false;
    this.resultMaster = new Result();
  }

  UserChanged(event: any) {
    debugger;
    let eventData: UsersWeb = event as UsersWeb;

    this.selectStatus = false;
    for (var i = 0; i < this.ParentmenuList.length; i++) {
      this.ParentmenuList[i].isShowable =
        this.ParentmenuList[i].MenuOwner == 'All'
          ? true
          : eventData.UserType == this.ParentmenuList[i].MenuOwner
          ? true
          : false;
      this.ParentmenuList[i].Checked = false;
    }
    for (var i = 0; i < this.ChildmenuList.length; i++) {
      this.ChildmenuList[i].isShowable =
        this.ChildmenuList[i].MenuOwner == 'All'
          ? true
          : eventData.UserType == this.ChildmenuList[i].MenuOwner
          ? true
          : false;
      this.ChildmenuList[i].Checked = false;
    }

    this.http.get<Result>(this.env.apiUrl + 'api/menus/select_all_by_user?userName=' + eventData.username).subscribe(
      (result) => {
        this.resultMaster = result;
        debugger;
        if (this.resultMaster.Status == true) {
          // this.designationList = JSON.parse(this.resultMaster.Data);
          let dataModel: WebMenu[] = this.resultMaster.Data as WebMenu[];

          for (var i = 0; i < dataModel.length; i++) {
            for (var j = 0; j < this.ParentmenuList.length; j++) {
              if (this.ParentmenuList[j].isShowable) {
                if (dataModel[i].ID == this.ParentmenuList[j].ID) {
                  this.ParentmenuList[j].Checked = true;
                }
              }
            }
            for (var k = 0; k < this.ChildmenuList.length; k++) {
              if (dataModel[i].ID == this.ChildmenuList[k].ID) {
                this.ChildmenuList[k].Checked = true;
              }
            }
          }
        } else {
          this.alertService.error(this.resultMaster.Message as string);
        }
      },
      (error) => {
        this.alertService.error(error.statusText + ':' + error.message);
      }
    );
  }

  loadMenuData() {
    //let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.http.get<Result>(this.env.apiUrl + 'api/menus/select_all_parent').subscribe(
      (result) => {
        this.resultMaster = result;
        if (this.resultMaster.Status == true) {
          // this.designationList = JSON.parse(this.resultMaster.Data);
          this.ParentmenuList = this.resultMaster.Data as WebMenu[];
        }
      },
      (error) => {
        console.error(error);
        this.alertService.error(error.error);
      }
    );

    this.http.get<Result>(this.env.apiUrl + 'api/menus/select_all_child').subscribe(
      (result) => {
        this.resultMaster = result;
        if (this.resultMaster.Status == true) {
          // this.designationList = JSON.parse(this.resultMaster.Data);
          this.ChildmenuList = this.resultMaster.Data as WebMenu[];
        }
      },
      (error) => {
        console.error(error);
        this.alertService.error(error.error);
      }
    );

    this.http.get(this.env.apiUrl + 'api/account').subscribe(
      (result) => {
        // this.designationList = JSON.parse(this.resultMaster.Data);
        this.userList = result as UsersWeb[];
      },
      (error) => console.error(error)
    );
  }

  backbuttonClick() {
    this.alertService.clear();
    if (this.selectStatus == true) {
      for (var i = 0; i < this.ParentmenuList.length; i++) {
        this.ParentmenuList[i].Checked = false;
      }
      for (var i = 0; i < this.ChildmenuList.length; i++) {
        this.ChildmenuList[i].Checked = false;
      }
      this.selectStatus = false;
    } else {
      for (var i = 0; i < this.ParentmenuList.length; i++) {
        if (this.ParentmenuList[i].isShowable) {
          this.ParentmenuList[i].Checked = true;
        }
      }
      for (var i = 0; i < this.ChildmenuList.length; i++) {
        var isShowable = this.ParentmenuList.filter((t) => t.ID === this.ChildmenuList[i].ParentID)[0].isShowable;
        if (isShowable) {
          this.ChildmenuList[i].Checked = true;
        }
      }
      this.selectStatus = true;
    }
  }

  savebuttonClick() {
    this.alertService.clear();
    if (!this.UserName) {
      this.alertService.error('Select User');
      return;
    }

    let userMenus: any[] = [];
    //var meunuIds: string;
    // meunuIds = '';

    this.selectStatus = false;
    for (var i = 0; i < this.ParentmenuList.length; i++) {
      if (this.ParentmenuList[i].Checked == true) {
        var um: any = {};
        um.MenuId = this.ParentmenuList[i].ID;
        um.UserId = this.UserName;
        userMenus.push(um);
      }
    }
    for (var i = 0; i < this.ChildmenuList.length; i++) {
      if (this.ChildmenuList[i].Checked == true) {
        //meunuIds += this.ChildmenuList[i].ID + ',';

        var um: any = {};
        um.MenuId = this.ChildmenuList[i].ID;
        um.UserId = this.UserName;
        userMenus.push(um);
      }
    }

    //userMenus.ID = meunuIds;
    //userMenus.UserName = this.UserName;

    var url: string = 'api/menus/Menus_InsertUpdate';
    //if (this.model.RawCategoryID)
    //  url = 'api/setup/RawCategorySetup_Update';

    this.http.post<Result>(this.env.apiUrl + url, userMenus).subscribe(
      (result) => {
        this.resultMaster = result;
        if (this.resultMaster.Status == true) {
          // this.designationList = JSON.parse(this.resultMaster.Data);
          this.alertService.success('Data Saved Successfully');
        } else {
          this.alertService.error(this.resultMaster.Message as string);
        }
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }

  ngOnInit(): void {
    this.loadMenuData();
  }
}
