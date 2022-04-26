import { Component, OnInit } from '@angular/core';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';
import { CircularPriceChangedDetail } from '@app/models/CircularPriceChangedDetail';

@Component({
  selector: 'app-circular-price-change-approve',
  templateUrl: './circular-price-change-approve.component.html',
  styleUrls: ['./circular-price-change-approve.component.scss'],
})
export class CircularPriceChangeApproveComponent implements OnInit {
  public Cpcddl = [];
  public CPCNo: string | undefined;
  public totalItem: number | undefined;
  public itemList: CircularPriceChangedDetail[];
  constructor(private http: HttpClient, private alertService: AlertService, private env: EnvService) {
    this.itemList = [];
  }

  GetAllPending() {
    this.http.get(this.env.apiUrl + 'CircularPriceChanged/GetPending').subscribe(
      (response) => {
        this.Cpcddl = response as any;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }

  GetCircularDetails(cpno: any) {
    this.http.get(this.env.apiUrl + 'CircularPriceChanged/GetCircularDetails?cpno=' + cpno).subscribe(
      (response) => {
        this.itemList = response as CircularPriceChangedDetail[];
        this.totalItem = this.itemList.length;
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }

  backButtonClick() {
    this.itemList = [];
    this.CPCNo = undefined;
  }

  saveButtonClick() {
    if (this.CPCNo === undefined || this.CPCNo === null) {
      this.alertService.warning('Select pending price change');
      return;
    }
    this.alertService.confirm('Are you sure to save', () => {
      this.http.post(this.env.apiUrl + 'CircularPriceChanged/saveCircularPriceChangeApprove', this.itemList).subscribe(
        (result) => {
          this.alertService.success('Save Successfull');
          this.itemList = [];
          this.CPCNo = undefined;
          this.GetAllPending();
        },
        (error) => {
          this.alertService.error(error.error);
        }
      );
    });
  }
  ngOnInit(): void {
    this.GetAllPending();
  }
}
