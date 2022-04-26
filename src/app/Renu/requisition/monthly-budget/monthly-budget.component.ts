import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';
import { MonthlyBudget } from '@app/models/MonthlyBudget';

@Component({
  selector: 'app-monthly-budget',
  templateUrl: './monthly-budget.component.html',
  styleUrls: ['./monthly-budget.component.scss'],
})
export class MonthlyBudgetComponent implements OnInit {
  public UserID: string | undefined;
  public ShopID: string | undefined;
  public cyear: number | undefined;
  public budgetList: MonthlyBudget[] = [];
  public yearList = [];
  public shopList = [];
  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {}
  AssignYear(year: any) {
    this.cyear = year;
    this.shopDDL();
  }
  ShopListDDL() {
    this.http.get(this.env.apiUrl + 'api/ShopList').subscribe(
      (result) => {
        this.shopList = result as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }
  // AssignShop(shop: any) {
  //   this.ShopID = shop;
  //   this.shopDDL();
  // }
  async yearDDL() {
    const promise = this.http.get(this.env.apiUrl + 'MonthlyBudget/YearList').toPromise();
    return promise.then(
      (response) => {
        this.yearList = response as [];
        this.cyear = this.yearList[0]['Year'];
      },
      (error: any) => {
        this.alertService.warning(error.error);
      }
    );
  }
  async shopDDL() {
    const promise = this.http.get(this.env.apiUrl + 'MonthlyBudget/GetShopBudget?year=' + this.cyear).toPromise();
    return promise.then(
      (response) => {
        this.budgetList = response as MonthlyBudget[];
      },
      (error: any) => {
        this.alertService.warning(error.error);
      }
    );
  }

  async SaveMonthlyBudget(item: MonthlyBudget, money: any, month: any) {
    item.Year = this.cyear;
    item.CreatedBy = this.UserID;
    //item.ShopID = this.ShopID;
    item.CreatedDate = new Date();
    if (money == null || money == undefined || money == 0) {
      this.alertService.warning('Please Add Budget to Save');
      return;
    }
    this.alertService.confirm('Are you Sure to Add Budget Money ' + money, async () => {
      let promise = this.http
        .post<MonthlyBudget>(this.env.apiUrl + 'MonthlyBudget/SaveMonthlyBudget', item)
        .toPromise();
      return promise
        .then((resp) => {
          this.shopDDL();
          this.alertService.success('Budget set successfully for ' + month + '/' + item.Year);
        })
        .catch((err) => {
          this.alertService.error(err.error);
        });
    });
  }

  async ngOnInit() {
    this.UserID = this.credentialsService.credentials?.username;
    // this.ShopID=this.credentialsService.credentials?.usersShop[0].ShopID;
    await this.yearDDL();
    await this.shopDDL();
    this.ShopListDDL();
  }
}
