import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { DataTablesResponse } from '@app/models/DataTablesResponse';
import { ItemList } from '@app/models/ItemList';
import { Result } from '@app/models/Result';
import { EnvService } from '@env/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-items-approve',
  templateUrl: './items-approve.component.html',
  styleUrls: ['./items-approve.component.scss'],
})
export class ItemsApproveComponent implements AfterViewInit, OnInit {
  public getItemListDDL: any | undefined;
  public ItemConvert: any | undefined;
  public addItemList: any | undefined;
  dtOptions: DataTables.Settings = {};
  public dataList: ItemList[];
  public ApprovedList: ItemList[];
  public resultMaster: Result | undefined;
  public buttonText: string;

  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: any;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private sanitizer: DomSanitizer,
    private credentinal: CredentialsService
  ) {
    this.buttonText = 'Save';
    this.dataList = [];
    this.ApprovedList = [];
  }

  saveButtonClick() {
    this.dataList.forEach((element) => {
      if (element.isAuthorized == true) {
        this.ApprovedList.push(element);
      }
    });

    this.http.post<Result>(this.env.apiUrl + 'ItemList/UpdateAuthorized', this.ApprovedList).subscribe(
      (result) => {
        this.alertService.success('Data Saved Successfully');
        this.rerender();
      },
      (error) => {
        this.alertService.error(error.error);
      }
    );
  }

  loadAllUser() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      searching: false,
      paging: false,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(this.env.apiUrl + 'ItemList/GetForDataTableForAuth', dataTablesParameters, {})
          .subscribe((resp) => {
            that.dataList = resp.data as ItemList[];
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: 'sBarcode', orderable: false },
        { data: 'Barcode', orderable: false },
        { data: 'SupName', orderable: false },
        { data: 'ItemName', orderable: false },
        { defaultContent: '', data: 'Empty', orderable: false },
      ],
    };
  }

  ngOnInit(): void {
    this.loadAllUser();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  //ngOnDestroy(): void {
  //   Do not forget to unsubscribe the event
  //  this.dtTrigger.unsubscribe();
  //}

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
