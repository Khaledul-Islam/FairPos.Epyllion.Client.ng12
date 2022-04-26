import { Byte } from '@angular/compiler/src/util';

export class Supplier {
  SupID: string | undefined;
  RegName: string | undefined;
  RegAdd1: string | undefined;
  RegAdd2: string | undefined;
  Email: string | undefined;
  RegPhone: string | undefined;
  RegFax: string | undefined;

  RegWeb: string | undefined;
  RegEmail: string | undefined;
  ChkRegOwner: boolean | undefined;
  ChkRegPartner: boolean | undefined;
  chkCashCheq: boolean | undefined;
  chkBEFTN: boolean | undefined;

  Supname: string | undefined;
  TradeAdd1: string | undefined;
  TradeAdd2: string | undefined;
  TradePhone: string | undefined;
  TradeFax: string | undefined;
  TradeWeb: string | undefined;

  TradeEmail: string | undefined;
  chkTradeMember: boolean | undefined;
  chkTradeDirector: boolean | undefined;
  GenCName: string | undefined;
  GenCDesig: string | undefined;
  GenCCell: string | undefined;
  GenCEmail: string | undefined;
  MgtCName: string | undefined;
  MgtCDesig: string | undefined;
  MgtCCell: string | undefined;
  MgtCEmail: string | undefined;
  MngCname: string | undefined;
  MngCdesig: string | undefined;
  MngCCell: string | undefined;
  MngCEmail: string | undefined;
  FinCname: string | undefined;
  FinCDesig: string | undefined;
  FinCCell: string | undefined;
  FinCEmail: string | undefined;
  gMargin: number | undefined;

  gMarginTP: number | undefined;
  gMarginAVG: number | undefined;
  chkgMarginAP: boolean | undefined;
  asDays: number | undefined;
  sacDays: number | undefined;
  B2BDays: number | undefined;
  SupType: string | undefined;
  crDays: number | undefined;
  chkAC: boolean | undefined;
  chkPO: boolean | undefined;
  chkCash: boolean | undefined;
  IssueFor: string | undefined;
  Bank: string | undefined;
  BankBR: string | undefined;
  BankBRCode: string | undefined;

  ACCName: string | undefined;
  ACCnum: string | undefined;
  ACCNB: string | undefined;
  ACCtype: string | undefined;
  ACCMNB: string | undefined;
  chkSupDay: boolean | undefined;
  chkSupWeek: boolean | undefined;
  chkSupMonth: boolean | undefined;
  chkSupAsPer: boolean | undefined;
  DeliveryDays: number | undefined;
  TransportMode: string | undefined;
  chkDamageRep: boolean | undefined;
  chkDamageRet: boolean | undefined;
  chkSlowRep: boolean | undefined;

  chkSlowRet: boolean | undefined;
  chkShortRep: boolean | undefined;
  chkShortRet: boolean | undefined;
  chkExpireRep: boolean | undefined;
  chkExpireRet: boolean | undefined;
  InformDay: number | undefined;
  chkTradeLicence: boolean | undefined;

  chkBSTIdocument: boolean | undefined;
  chkVATCertificate: boolean | undefined;
  chkTINCertificate: boolean | undefined;
  chkOtherDocument: boolean | undefined;
  chkTypeLocal: boolean | undefined;
  chkTypeForeign: boolean | undefined;
  chkTypeOther: boolean | undefined;

  TraderEMOSCode: string | undefined;
  SupArea: string | undefined;
  SupCommodity: string | undefined;
  SPonTP: number | undefined;
  SPonMRP: number | undefined;
  SplDiscount: number | undefined;
  SupCategory: string | undefined;

  Fired: boolean | undefined;
  DOE: Date | undefined;
  Address: string | undefined;
  Phone: string | undefined;
  MaturityDays: number | undefined;
}

export class SupplierDoc {
  SupID: string | undefined;
  TradeFileNo: string | undefined;
  TradeFileType: string | undefined;
  TradeFile: Byte | undefined;
  BSTIFileType: string | undefined;
  BSTIFile: any | undefined;
  BSTIFileNo: string | undefined;
  VatFileType: string | undefined;
  VatFile: any | undefined;
  VatFileNo: string | undefined;
  TinFileType: string | undefined;
  TinFile: any | undefined;
  TinFileNo: string | undefined;
  OtherDocType: string | undefined;
  OtherDoc: any | undefined;
}
