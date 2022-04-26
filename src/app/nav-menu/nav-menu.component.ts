import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { Result } from '@app/models/Result';
import { UsersWeb } from '@app/models/UsersWeb';
import { WebMenu } from '@app/models/WebMenu';
import { EnvService } from '@env/environment';

declare var $: any;

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit {
  public resultMaster: Result | undefined;

  //collapse() {
  //  this.isExpanded = false;
  //}

  //toggle() {
  //  this.isExpanded = !this.isExpanded;
  //}

  public ParentmenuList: WebMenu[] | undefined;
  public ChildmenuList: WebMenu[] | undefined;

  constructor(
    private _http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {}

  loadMenuData() {
    let currentUser = this.credentialsService.credentials as UsersWeb;

    if (currentUser) {
      this._http
        .get<Result>(this.env.apiUrl + 'api/menus/select_all_parent_by_user?userName=' + currentUser.username)
        .subscribe(
          (result) => {
            this.resultMaster = result;

            if (this.resultMaster.Status == true) {
              this.ParentmenuList = this.resultMaster.Data as WebMenu[];
            }
          },
          (error) => {
            console.error(error);
          }
        );

      this._http
        .get<Result>(this.env.apiUrl + 'api/menus/select_all_child_by_user?userName=' + currentUser.username)
        .subscribe(
          (result) => {
            this.resultMaster = result;
            if (this.resultMaster.Status == true) {
              this.ChildmenuList = this.resultMaster.Data as WebMenu[];
            }
          },
          (error) => {
            console.error(error);
            //this._alertService.error(error);
            //window.scroll(0, 0);
          }
        );
    }

    var timer = setTimeout(() => {
      try {
        $('#sidebarnav').metisMenu('dispose');
      } catch (error) {}

      $('#sidebarnav').metisMenu();
      clearTimeout(timer);
    }, 2000);
  }

  ngOnInit() {
    this.loadMenuData();
  }
}
