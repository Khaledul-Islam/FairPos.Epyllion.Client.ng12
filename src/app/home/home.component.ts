import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';
import { DashBoardItems } from '@app/models/DashBoardItems';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public dashBoard: DashBoardItems;
  isLoading = false;

  constructor(private http: HttpClient, private alertService: AlertService
    , private env: EnvService
    , private sanitizer: DomSanitizer
    , private credentinal: CredentialsService) {
    this.dashBoard = new DashBoardItems();
  }

  async getDashboardItem() {
    let promise = this.http.get('Report/GetDashBoardItem').toPromise();
    return promise.then(resp => {
      this.dashBoard = resp as DashBoardItems
    })
  }
  ngOnInit() {
    this.isLoading = true;
    this.getDashboardItem()
  }
}
