import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Buy } from '@app/models/Buy';
import { EnvService } from '@env/environment';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-damage-modal',
  templateUrl: './damage-modal.component.html',
  styleUrls: ['./damage-modal.component.scss'],
})
export class DamageModalComponent implements OnInit {
  public parentDataList: Buy[];
  public childDataList: Buy[];
  public details: Buy;
  public closeResult: string;
  public supId: string | undefined;
  public shopid: string | undefined;
  public IsDamage: Boolean | undefined;
  private modalReference: any;
  public childitemflag: boolean = true;

  constructor(private http: HttpClient, private modalService: NgbModal, private env: EnvService) {
    this.closeResult = '';
    this.details = new Buy();
    this.parentDataList = [];
    this.childDataList = [];
  }

  ngOnInit(): void {}

  @Output() SelectEvent = new EventEmitter<object>();

  backModalClick() {
    this.childitemflag = true;
    this.childDataList = [];
  }
  destroyer() {
    this.parentDataList = [];
    this.childDataList = [];
    this.details = new Buy();
  }
  close(content: any) {
    //close btn execute
    this.modalReference.close();
  }

  async clickFromParent(_supid: string, _shopid: string, _IsDamage: Boolean) {
    // 1st execute
    this.supId = _supid;
    this.shopid = _shopid;
    this.IsDamage = _IsDamage;
    if (this.IsDamage === false) {
      await this.GetMainProductsSupplier();
    }
    if (this.IsDamage === true) {
      await this.GetMainProductsSupplier();
    }
    setTimeout(() => {
      let element: HTMLElement = document.getElementById('btnLoadItemlist') as HTMLElement;
      element.click();
    }, 1);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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
    this.modalReference.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  saveButtonClick(item: any) {
    this.SelectEvent.emit(item);
    this.modalReference.close();
  }
  async GetByBarcodeExp(item: Buy) {
    let linkurl = '';
    if (this.IsDamage === true) {
      linkurl = 'DamageLoss/GetDamageBarcodeExp?expbarcode=' + item.BarCode;
    }
    if (this.IsDamage === false) {
      linkurl = 'ItemConversion/GetByBarcodeExp?expbarcode=' + item.BarCode;
    }

    let promise = this.http.get(this.env.apiUrl + linkurl).toPromise();
    return promise.then((response) => {
      this.details = response as Buy;
      this.SelectEvent.emit(this.details);
      this.modalReference.close();
      this.childitemflag = true;
      return this.details;
    });
  }
  async GetNewBarcodeBySbarcode(item: Buy) {
    let linkurl = '';
    if (this.IsDamage === true) {
      linkurl = 'DamageLoss/GetDamageBarcodeBySbarcode?sBarcode=' + item.sBarCode + '&qty=999999999999';
    }
    if (this.IsDamage === false) {
      linkurl = 'ItemConversion/GetNewBarcodeBySbarcode?sBarcode=' + item.sBarCode + '&qty=999999999999';
    }
    let promise = this.http.get(this.env.apiUrl + linkurl).toPromise();
    return promise.then((response) => {
      this.childitemflag = false;
      return (this.childDataList = response as Buy[]);
    });
  }
  async GetMainProductsSupplier() {
    let linkurl = '';
    if (this.IsDamage === true) {
      linkurl = 'DamageLoss/GetDamageProductsSupplier?SupId=' + this.supId;
    }
    if (this.IsDamage === false) {
      linkurl = 'DamageLoss/GetMainProductsSupplier?SupId=' + this.supId + '&ShopID=' + this.shopid;
    }
    let promise = this.http.get(this.env.apiUrl + linkurl).toPromise();
    return promise
      .then((resp) => {
        this.parentDataList = resp as Buy[];
      })
      .catch((err) => {
        console.error(err.error);
      });
  }
}
