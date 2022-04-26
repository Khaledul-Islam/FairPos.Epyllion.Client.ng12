import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { Buy } from '@app/models/Buy';
import { EnvService } from '@env/environment';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transfer-modal',
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.scss'],
})
export class TransferModalComponent implements OnInit {
  public parentDataList: Buy[];
  public childDataList: Buy[];
  public ItemDetails: Buy;
  public closeResult: string;
  public supId: string | undefined;
  public shopid: string | undefined;
  public APIURL: Object | undefined;
  private modalReference: any;
  public childitemflag: boolean = true;

  public parent: string | undefined;
  public child: string | undefined;
  public details: string | undefined;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private env: EnvService,
    private alertService: AlertService
  ) {
    this.closeResult = '';
    this.parentDataList = [];
    this.childDataList = [];
    this.ItemDetails = new Buy();
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
  }
  close(content: any) {
    //close btn execute
    this.modalReference.close();
  }

  async clickFromParent(_supid: string, _shopid: string, _apiurl: Object) {
    // 1st execute
    this.supId = _supid;
    this.shopid = _shopid;
    this.APIURL = _apiurl;
    this.parent = this.APIURL['parent'];
    this.child = this.APIURL['child'];
    this.details = this.APIURL['details'];
    if (this.parent?.length) {
      await this.GetTransferProducts();
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
  async GetTransferBarcodeExp(Barcode: any) {
    let promise = this.http.get(this.env.apiUrl + this.details + '?expbarcode=' + Barcode).toPromise();
    return promise.then((response) => {
      this.ItemDetails = response as Buy;
      this.SelectEvent.emit(this.ItemDetails);
      this.modalReference.close();
      this.childitemflag = true;
      return this.details;
    });
  }
  async AddButtonClick(item: Buy) {
    await this.GetTransferBarcodeExp(item.BarCode);
  }
  async GetTransferNewBarcode(sBarcode: any) {
    let promise = this.http
      .get(this.env.apiUrl + this.child + '?sBarcode=' + sBarcode + '&qty=999999999999')
      .toPromise();
    return promise
      .then((response) => {
        this.childitemflag = false;
        return (this.childDataList = response as Buy[]);
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }
  async SelectButtonClick(item: Buy) {
    await this.GetTransferNewBarcode(item.sBarCode);
  }
  async GetTransferProducts() {
    let promise = this.http
      .get(this.env.apiUrl + this.parent + '?SupId=' + this.supId + '&ShopID=' + this.shopid)
      .toPromise();
    return promise
      .then((resp) => {
        this.parentDataList = resp as Buy[];
      })
      .catch((error) => {
        this.alertService.error(error.error);
      });
  }
}
