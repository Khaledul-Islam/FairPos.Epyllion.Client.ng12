import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PurchaseOrder } from '@app/models/PurchaseOrder';
import { EnvService } from '@env/environment';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-arrival-modal',
  templateUrl: './arrival-modal.component.html',
  styleUrls: ['./arrival-modal.component.scss'],
})
export class ArrivalModalComponent implements OnInit {
  dtOptionsProduct: DataTables.Settings = {};
  public dataList: PurchaseOrder[];
  public PurchaseOrderModal: PurchaseOrder;
  public closeResult: string;
  public supId: string;
  private modalReference: any;

  constructor(private http: HttpClient, private modalService: NgbModal, private env: EnvService) {
    this.PurchaseOrderModal = new PurchaseOrder();
    this.dataList = [];
    this.closeResult = '';
    this.supId = '';
  }

  ngOnInit(): void {
    this.loadDataTables();
  }

  @Output() SelectEvent = new EventEmitter<object>();

  close(content: any) {
    //close btn execute
    this.modalReference.close();
  }

  clickFromParent(_supid: string) {
    // 1st execute
    this.supId = _supid;

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
    this.PurchaseOrderModal = new PurchaseOrder();
  }

  loadDataTables() {
    const that = this;
    this.dtOptionsProduct = {
      ajax: (any, callback) => {
        that.http.get(this.env.apiUrl + 'ItemList/ApproveItemListbySupID?SupID=' + this.supId).subscribe((resp) => {
          that.dataList = resp as PurchaseOrder[];
          callback({
            data: [],
          });
        });
      },
    };
  }
}
