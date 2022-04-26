import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { EnvService } from '@env/environment';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Buy } from '@app/models/Buy';
import { SalesOrder } from '@app/models/SalesOrder';

@Component({
  selector: 'app-verify-item-staff',
  templateUrl: './verify-item-staff.component.html',
  styleUrls: ['./verify-item-staff.component.scss'],
})
export class VerifyItemStaffComponent implements OnInit {
  public stockType = 'Staff Stock';
  public CounterID: string | undefined;
  public totalItem: string | undefined;
  public verifiedItem = 0;
  public UserID: string | undefined;
  public SO_NO: string | undefined;
  private modalReference: any;
  @Output() SelectEvent = new EventEmitter<object>();

  public orderDetailsList: SalesOrder[];
  public verifiedOrderList: SalesOrder[];
  itemDetails: Buy = new Buy();
  public itemList: Buy[];

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private env: EnvService,
    private alertService: AlertService,
    private credentialsService: CredentialsService
  ) {
    this.itemList = [];
    this.orderDetailsList = [];
    this.verifiedOrderList = [];
  }

  ngOnInit(): void {}
  async onModalOpen() {}

  close(content: any) {
    //close btn execute
    this.itemDetails = new Buy();
    this.orderDetailsList = [];
    this.verifiedOrderList = [];
    this.modalReference.close();
  }

  async clickFromParent(_totalItem: string, orderDetailsList: any, _sono: any) {
    // 1st execute
    this.totalItem = _totalItem;
    this.orderDetailsList = orderDetailsList;
    this.SO_NO = _sono;
    this.onModalOpen();
    setTimeout(() => {
      let element: HTMLElement = document.getElementById('btnLoadItemlist') as HTMLElement;
      element.click();
    }, 1);
  }
  async GetItemDetails(barcode: any) {
    let promise = this.http
      .get(this.env.apiUrl + 'SalesOrder/GetProductInfoByBarcodeBuyStaff?barcode=' + barcode + '&supplierId=All')
      .toPromise();
    return promise
      .then((resp) => {
        this.itemDetails = resp as Buy;
        this.itemDetails.Qty = 1;
        return this.itemDetails;
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  async verifiedApiCall() {
    let promise = this.http.get(this.env.apiUrl + 'SalesOrderPrint/SalesOrderPrint?so=' + this.SO_NO).toPromise();
    return promise
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        this.alertService.error(err.error);
      });
  }
  async verifyButtonClick() {
    if (this.itemDetails.IsConversionItem == true) {
      this.alertService.warning('It a Conversion Item');
      return;
    }
    if (this.itemDetails == null) {
      this.alertService.warning('No item for verify');
      return;
    }
    if (Number(this.itemDetails.Qty) <= 0) {
      this.alertService.warning('Enter Sales order qty');
      return;
    }
    let data = this.orderDetailsList.find((x) => x.Barcode === this.itemDetails.BarCode);
    if (data == null || data == undefined) {
      this.alertService.warning('This Barcode is not matched in Delivery item list');
      return;
    }
    if (data.QTY != this.itemDetails.Qty) {
      this.alertService.warning('Delivery quantity is not matched');
      return;
    }
    let check = this.verifiedOrderList.find((x) => x.Barcode === this.itemDetails.BarCode);
    if (check != null || check != undefined) {
      this.alertService.warning('This barocde already taken');
      return;
    }
    this.verifiedOrderList.push(data);
    this.verifiedItem = this.verifiedOrderList.length;
    this.itemDetails = new Buy();
    if (Number(this.verifiedItem) == Number(this.totalItem)) {
      await this.verifiedApiCall();
      this.SelectEvent.emit('test' as any);
      this.alertService.success('verified');
      this.modalReference.close();
      this.itemDetails = new Buy();
      this.orderDetailsList = [];
      this.verifiedOrderList = [];
    }
  }

  open(content: any) {
    let options: NgbModalOptions = {
      size: 'xl', //but this work on this
      backdrop: 'static',
      keyboard: false,
      centered: true,
    };
    this.modalReference = this.modalService.open(content, options);
  }
}
