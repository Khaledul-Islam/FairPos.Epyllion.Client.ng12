import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { AlertService } from '@app/@shared/AlertService';
import { PurchaseOrder } from '@app/models/PurchaseOrder';
import { EnvService } from '@env/environment';
import { ModalDismissReasons, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-item-selection-supplier',
  templateUrl: './item-selection-supplier.component.html',
  styleUrls: ['./item-selection-supplier.component.scss'],
})
export class ItemSelectionSupplierComponent implements OnInit {
  dtOptionsProduct: DataTables.Settings = {};
  public dataList: PurchaseOrder[];
  public testList: PurchaseOrder[];
  public PurchaseOrderModal: PurchaseOrder;
  public closeResult: string;
  public supId: string;

  private modalReference: any;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private modalService: NgbModal,
    private env: EnvService
  ) {
    this.PurchaseOrderModal = new PurchaseOrder();
    this.dataList = [];
    this.testList = [];
    this.closeResult = '';
    this.supId = '';
  }

  ngOnInit(): void {
    this.loadDataTables();
    //this.GetItemList();
  }

  @Output() SelectEvent = new EventEmitter<object>();

  CalculatePackSize(item: PurchaseOrder) {
    this.PurchaseOrderModal = item;
    this.PurchaseOrderModal.QTY =
      Number(this.PurchaseOrderModal.POPackSizeQTY) * Number(this.PurchaseOrderModal.POPackSize);
    this.testSelected(item);
    item.ischeck = true;
  }
  testSelected(item: PurchaseOrder) {
    if (this.PurchaseOrderModal.POPackSizeQTY == null || this.PurchaseOrderModal.POPackSizeQTY == undefined) {
      this.alertService.warning('Pack Size Required');
      item.ischeck = false;
      return;
    }
    if (this.testList != null) {
      var found = this.testList.findIndex((itm) => {
        return itm.Barcode === item.Barcode;
      });
      if (found > -1) {
        this.testList.splice(found, 1);
        return;
      }
      this.PurchaseOrderModal = item;
      this.testList.push(this.PurchaseOrderModal);
    }
  }
  ItemsSelected(item_selected: any) {
    this.SelectEvent.emit(item_selected);
    this.modalReference.close();
  }

  close(content: any) {
    //this.modalService(content, options);
    this.modalReference.close();
  }

  clickFromParent(_supid: string) {
    this.supId = _supid;
    setTimeout(() => {
      let element: HTMLElement = document.getElementById('btnLoadItemlist') as HTMLElement;
      element.click();
      //this.child.setLoadMode();
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
  saveButtonClick() {
    if (this.testList.length == 0) {
      this.alertService.warning('No Item to Add');
      return;
    }

    this.SelectEvent.emit(this.testList);
    this.modalReference.close();
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
