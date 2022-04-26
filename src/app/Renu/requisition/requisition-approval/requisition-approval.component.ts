import { Component, OnInit, ViewChild } from '@angular/core';
import { CredentialsService } from '@app/auth/credentials.service';
import { EnvService } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '@app/@shared/AlertService';
import { AutoRequisition } from '@app/models/AutoRequisition';

@Component({
  selector: 'app-requisition-approval',
  templateUrl: './requisition-approval.component.html',
  styleUrls: ['./requisition-approval.component.scss'],
})
export class RequisitionApprovalComponent implements OnInit {
  public UserID: string | undefined;
  public ShopID: string | undefined;
  public reqTempLst: AutoRequisition[];
  public totalQty = 0;
  public totalAmount = 0;
  public totalItem = 0;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private credentialsService: CredentialsService
  ) {
    this.reqTempLst = [];
  }
  async submitButtonClick() {
    if (this.reqTempLst.length <= 0) {
      this.alertService.warning('No item to Save');
      return;
    }
    this.alertService.confirm('Are you sure you want to Save this', () => {
      this.reqTempLst.forEach((element) => {
        element.ApprovedBy = this.UserID;
        element.ApproveStatus = 'APPROVED';
        element.ApprovedDate = new Date();
      });
      let promise = this.http
        .post(this.env.apiUrl + 'RequisitionApproval/SaveApproveRequisition', this.reqTempLst)
        .toPromise();
      return promise
        .then((resp) => {
          this.totalQty = 0;
          this.totalAmount = 0;
          this.totalItem = 0;
          this.reqTempLst = [];
          this.alertService.success('Approved successfully');
          return resp;
        })
        .catch((err) => {
          this.alertService.error(err.error);
        });
    });
  }
  rejectButtonClick() {
    this.alertService.confirm('Are you sure to reject this', () => {
      this.reqTempLst.forEach((element) => {
        element.ApprovedBy = this.UserID;
        element.ApproveStatus = 'REJECT';
        element.ApprovedDate = new Date();
      });
      let promise = this.http
        .post(this.env.apiUrl + 'RequisitionApproval/RequisitionReject', this.reqTempLst)
        .toPromise();
      return promise
        .then((resp) => {
          this.totalQty = 0;
          this.totalAmount = 0;
          this.totalItem = 0;
          this.reqTempLst = [];
          this.alertService.success('Rejected successfully');
          return resp;
        })
        .catch((err) => {
          this.alertService.error(err.error);
        });
    });
  }
  ChangeActualBoxQty(item: AutoRequisition) {
    let ten_percent = Math.round((Number(item.ActualBoxQty) * 10) / 100);
    let diff_qty = Math.abs(Number(item.ActualBoxQty) - Number(item.ApprovedBoxQty));
    if (diff_qty > ten_percent) {
      this.alertService.warning('Apporved qty is greater then 10%');
      item.ApprovedBoxQty = item.ActualBoxQty;
      return;
    }
    if (diff_qty <= ten_percent) {
      this.alertService.success('updated');
      return;
    }
  }

  async GetTempRequistion() {
    let promise = this.http
      .get(this.env.apiUrl + 'RequisitionApproval/AutoRequistionsApprovalLoad?shopid=' + this.ShopID)
      .toPromise();
    return promise
      .then((resp) => {
        this.reqTempLst = resp as AutoRequisition[];
        this.totalItem = this.reqTempLst.length;
        this.totalAmount = 0;
        this.reqTempLst.forEach((element) => {
          this.totalQty = this.totalQty + Number(element.ActualBoxQty);
          this.totalAmount = this.totalAmount + Number(element.ActualBoxQty) * Number(element.RPU);
        });
        return this.reqTempLst;
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  async clearButtonClick() {
    this.alertService.confirm('Are you sure to clear the data', () => {
      let promise = this.http
        .get(this.env.apiUrl + 'AutoRequisition/RemoveAllTempRequistion?userId=' + this.UserID)
        .toPromise();
      return promise
        .then((resp) => {
          this.reqTempLst = [];
          return resp;
        })
        .catch((err) => {
          this.alertService.error(err.error);
        });
    });
  }

  async ngOnInit() {
    this.UserID = this.credentialsService.credentials?.username;
    this.ShopID = this.credentialsService.credentials?.usersShop[0].ShopID;
    this.GetTempRequistion();
  }
}
