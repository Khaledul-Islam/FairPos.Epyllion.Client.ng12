import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '@app/@shared/AlertService';
import { CredentialsService } from '@app/auth';
import { DataTablesResponse } from '@app/models/DataTablesResponse';
import { Product } from '@app/models/Product';
import { Result } from '@app/models/Result';
import { Supplier, SupplierDoc } from '@app/models/Supplier';
import { EnvService } from '@env/environment';
import { data } from 'jquery';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
})
export class SupplierComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  public model: Supplier;
  public modelDoc: SupplierDoc;
  public dataList: Supplier[] | undefined;

  public resultMaster: Result | undefined;

  public isInsertMode: boolean;
  public isUpdateMode: boolean;

  public buttonText: string;

  public gMarginRadio: string;
  public gPaymentTermsRadio: string;
  public gPaymentModeRadio: string;
  public gSupplierType: string;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private env: EnvService,
    private sanitizer: DomSanitizer,
    private credentinal: CredentialsService
  ) {
    this.isInsertMode = false;
    this.buttonText = 'Save';
    this.isUpdateMode = false;

    this.model = new Supplier();
    this.modelDoc = new SupplierDoc();

    this.gMarginRadio = '';
    this.gPaymentTermsRadio = '';
    this.gPaymentModeRadio = '';
    this.gSupplierType = '';
  }

  deleteButtonClick() {
    this.alertService.confirm('are you sure you want to remove this data', () => {
      this.http.post<Result>(this.env.apiUrl + 'api/Supplier/delete?id=' + this.model.SupID, null).subscribe(
        (result) => {
          this.alertService.success('Data Delete Successfully');
          this.backButtonClick();
        },
        (error) => {
          console.error(error);
          this.alertService.error(error.error);
        }
      );
    });
  }

  saveButtonClick() {
    this.alertService.clear();

    //this.userServer.userImages = new UserImage();
    if (this.gMarginRadio == 'MRP') {
      this.model.gMarginTP = 0;
      this.model.gMarginAVG = 0;
    } else if (this.gMarginRadio == 'TP') {
      this.model.gMargin = 0;
      this.model.gMarginAVG = 0;
    } else if (this.gMarginRadio == 'AVG') {
      this.model.gMargin = 0;
      this.model.gMarginTP = 0;
    } else if (this.gMarginRadio == 'AP') {
      this.model.gMargin = 0;
      this.model.gMarginTP = 0;
      this.model.gMarginAVG = 0;
    }

    if (this.gPaymentTermsRadio == 'asDays') {
      this.model.sacDays = 0;
      this.model.crDays = 0;
      this.model.B2BDays = 0;
    } else if (this.gPaymentTermsRadio == 'sacDays') {
      this.model.asDays = 0;
      this.model.crDays = 0;
      this.model.B2BDays = 0;
    } else if (this.gPaymentTermsRadio == 'crDays') {
      this.model.asDays = 0;
      this.model.sacDays = 0;
      this.model.B2BDays = 0;
    } else if (this.gPaymentTermsRadio == 'B2BDays') {
      this.model.asDays = 0;
      this.model.sacDays = 0;
      this.model.crDays = 0;
    }

    if (this.gPaymentModeRadio == 'chkAC') {
      this.model.chkAC = true;
      this.model.chkCashCheq = false;
      this.model.chkPO = false;
      this.model.chkBEFTN = false;
    } else if (this.gPaymentModeRadio == 'chkCashCheq') {
      this.model.chkAC = false;
      this.model.chkCashCheq = true;
      this.model.chkPO = false;
      this.model.chkBEFTN = false;
    } else if (this.gPaymentModeRadio == 'chkPO') {
      this.model.chkAC = false;
      this.model.chkCashCheq = false;
      this.model.chkPO = true;
      this.model.chkBEFTN = false;
    } else if (this.gPaymentModeRadio == 'chkBEFTN') {
      this.model.chkAC = false;
      this.model.chkCashCheq = false;
      this.model.chkPO = false;
      this.model.chkBEFTN = true;
    }

    if (this.gSupplierType == 'chkTypeLocal') {
      this.model.chkTypeLocal = true;
      this.model.chkTypeForeign = false;
      this.model.chkTypeOther = false;
    } else if (this.gSupplierType == 'chkTypeForeign') {
      this.model.chkTypeLocal = false;
      this.model.chkTypeForeign = true;
      this.model.chkTypeOther = false;
    } else if (this.gSupplierType == 'chkTypeOther') {
      this.model.chkTypeLocal = false;
      this.model.chkTypeForeign = false;
      this.model.chkTypeOther = true;
    }

    let formData: FormData = new FormData();
    formData.append('Document1', this.fileTradeLicence as any);
    formData.append('Document2', this.fileBSTI as any);
    formData.append('Document3', this.fileVAT as any);
    formData.append('Document4', this.fileTIN as any);
    formData.append('Document5', this.fileOther as any);
    formData.append('DocumentMain', JSON.stringify(this.model));
    formData.append('DocumentDoc', JSON.stringify(this.modelDoc));

    var url: string = 'api/Supplier/create';
    if (this.isUpdateMode) url = 'api/Supplier/update';

    this.alertService.confirm('Are you sure to save the data', () => {
      this.http.post<Result>(this.env.apiUrl + url, formData).subscribe(
        (result) => {
          // this.designationList = JSON.parse(this.resultMaster.Data);
          this.alertService.success('Data Saved Successfully');

          if (this.isUpdateMode) {
            this.backButtonClick();
          }
          this.model = new Supplier();
          //this.userServer.userImages =new UserImage();
        },
        (error) => {
          this.alertService.error(error.error);
        }
      );
    });

    //this.isInsertMode = false;
  }

  downloadButtonClick(fileName: string) {
    let fileType: string = '';
    if (fileName == 'inputGroupFile01') {
      fileType = 'TradeFileType';
    } else if (fileName == 'inputGroupFile02') {
      fileType = 'BSTIFileType';
    } else if (fileName == 'inputGroupFile03') {
      fileType = 'VatFileType';
    } else if (fileName == 'inputGroupFile04') {
      fileType = 'TinFileType';
    } else if (fileName == 'inputGroupFile05') {
      fileType = 'OtherDocType';
    }

    let dataType = 'application/octet-stream';
    let binaryData: any = [];

    this.http
      .get(this.env.apiUrl + 'api/Supplier/get_doc_details_by_id2?id=' + this.model.SupID + '&fileType=' + fileType, {
        responseType: 'blob',
      })
      .subscribe(
        (data) => {
          binaryData.push(data);

          let dataType = data.type;
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));

          if (fileName == 'inputGroupFile01') {
            downloadLink.setAttribute('download', this.modelDoc.TradeFileType as string);
          } else if (fileName == 'inputGroupFile02') {
            downloadLink.setAttribute('download', this.modelDoc.BSTIFileType as string);
          } else if (fileName == 'inputGroupFile03') {
            downloadLink.setAttribute('download', this.modelDoc.VatFileType as string);
          } else if (fileName == 'inputGroupFile04') {
            downloadLink.setAttribute('download', this.modelDoc.TinFileType as string);
          } else if (fileName == 'inputGroupFile05') {
            downloadLink.setAttribute('download', this.modelDoc.OtherDocType as string);
          }

          document.body.appendChild(downloadLink);
          downloadLink.click();
        },
        (error) => {
          console.error(error);
          this.alertService.error(error.error);
        }
      );
  }

  fileTradeLicence: File | undefined;
  fileBSTI: File | undefined;
  fileVAT: File | undefined;
  fileTIN: File | undefined;
  fileOther: File | undefined;

  FilePathTrade: string = 'Choose file';
  FilePathbSTI: string = 'Choose file';
  FilePathVAT: string = 'Choose file';
  FilePathTIN: string = 'Choose file';
  FilePathOther: string = 'Choose file';

  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      if (event.target.id == 'inputGroupFile01') {
        this.fileTradeLicence = fileList[0];
        this.FilePathTrade = this.fileTradeLicence.name;
      } else if (event.target.id == 'inputGroupFile02') {
        this.fileBSTI = fileList[0];
        this.FilePathbSTI = this.fileBSTI.name;
      } else if (event.target.id == 'inputGroupFile03') {
        this.fileVAT = fileList[0];
        this.FilePathVAT = this.fileVAT.name;
      } else if (event.target.id == 'inputGroupFile04') {
        this.fileTIN = fileList[0];
        this.FilePathTIN = this.fileTIN.name;
      } else if (event.target.id == 'inputGroupFile05') {
        this.fileOther = fileList[0];
        this.FilePathOther = this.fileOther.name;
      }
    } else {
      this.alertService.error('Something went Wrong.');
      //this.FilePath ='Choose file';
    }
  }

  createButtonClick() {
    this.isInsertMode = true;
    this.isUpdateMode = false;
    this.buttonText = 'Save';
    this.model = new Supplier();
  }

  backButtonClick() {
    this.isInsertMode = false;
    this.isUpdateMode = false;
    this.buttonText = 'Save';
  }

  editbuttonClick(id: any) {
    this.alertService.clear();

    this.isInsertMode = true;
    this.model = new Supplier();
    this.buttonText = 'Update';
    this.isUpdateMode = true;

    this.http.get<Result>(this.env.apiUrl + 'api/Supplier/get_details_by_id?id=' + id).subscribe(
      (result) => {
        this.resultMaster = result;
        if (this.resultMaster.Status == true) {
          // this.designationList = JSON.parse(this.resultMaster.Data);
          this.model = this.resultMaster.Data as Supplier;

          if (Number(this.model.gMargin) > 0) {
            this.gMarginRadio = 'MRP';
          }
          if (Number(this.model.gMarginTP) > 0) {
            this.gMarginRadio = 'TP';
          }
          if (Number(this.model.gMarginAVG) > 0) {
            this.gMarginRadio = 'AVG';
          }

          if (Number(this.model.asDays) > 0) {
            this.gPaymentTermsRadio = 'asDays';
          }
          if (Number(this.model.sacDays) > 0) {
            this.gPaymentTermsRadio = 'sacDays';
          }
          if (Number(this.model.crDays) > 0) {
            this.gPaymentTermsRadio = 'crDays';
          }
          if (Number(this.model.B2BDays) > 0) {
            this.gPaymentTermsRadio = 'B2BDays';
          }

          if (this.model.chkAC == true) {
            this.gPaymentModeRadio = 'B2BDays';
          } else if (this.model.chkCashCheq == true) {
            this.gPaymentModeRadio = 'chkCashCheq';
          } else if (this.model.chkPO == true) {
            this.gPaymentModeRadio = 'chkPO';
          } else if (this.model.chkBEFTN == true) {
            this.gPaymentModeRadio = 'chkBEFTN';
          }

          if (this.model.chkTypeLocal == true) {
            this.gSupplierType = 'chkTypeLocal';
          } else if (this.model.chkTypeForeign == true) {
            this.gSupplierType = 'chkTypeForeign';
          } else if (this.model.chkTypeOther == true) {
            this.gSupplierType = 'chkTypeOther';
          }
        }
      },
      (error) => {
        console.error(error);
        this.alertService.error(error.error);
      }
    );

    this.modelDoc = new SupplierDoc();
    this.http.get<Result>(this.env.apiUrl + 'api/Supplier/get_doc_details_by_id?id=' + id).subscribe(
      (result) => {
        this.resultMaster = result;
        if (this.resultMaster.Status == true) {
          this.modelDoc = this.resultMaster.Data as SupplierDoc;

          this.FilePathTrade = this.modelDoc.TradeFileType as string;
          this.FilePathbSTI = this.modelDoc.BSTIFileType as string;
          this.FilePathVAT = this.modelDoc.VatFileType as string;
          this.FilePathTIN = this.modelDoc.TinFileType as string;
          this.FilePathOther = this.modelDoc.OtherDocType as string;
        }
      },
      (error) => {
        console.error(error);
        this.alertService.error(error.error);
      }
    );
  }

  loadAllUser() {
    const that = this;

    //this._http.get<Result>(this._baseUrl + 'api/setup/User_SelectAll_Grid').subscribe(result => {
    //  this.resultMaster = result;
    //  if (this.resultMaster.Status == true) {

    //    // this.designationList = JSON.parse(this.resultMaster.Data);
    //    this.userList = this.resultMaster.Data as User[];

    //  }

    //}, error => console.error(error));

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            //'https://angular-datatables-demo-server.herokuapp.com/',
            this.env.apiUrl + 'api/Supplier/get_for_datatable',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            that.dataList = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: 'SupID' },
        { data: 'Supname' },
        { data: 'TradeAdd1' },
        { data: 'TradePhone' },
        { data: 'RegName' },
        { defaultContent: '', data: 'Empty', orderable: false },
      ],
    };
  }

  ngOnInit(): void {
    this.loadAllUser();
  }
}
