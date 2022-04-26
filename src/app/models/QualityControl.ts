export class QualityControl {
  public QcId: number | undefined;
  public ARRIVAL_NO: string | undefined;
  public Chln: string | undefined;
  public SupID: string | undefined;
  public sBarCode: string | undefined;
  public BarCode: string | undefined;
  public BarcodeExp: string | undefined;
  public ArrivalBox: number | undefined;
  public ArrivalQty: number | undefined;
  public QCQty: number | undefined;
  public QCBoxQty: number | undefined;
  public DiscPrcnt: number | undefined;
  public VATPrcnt: number | undefined;
  public PrdComm: number | undefined;
  public CPU: number | undefined;
  public RPU: number | undefined;
  public BuyDT: Date | undefined;
  public EXPDT: Date | undefined;
  public UserID: string | undefined;
  public GIFT_RATIO: number | undefined;
  public GIFT_DESCRIPTION: string | undefined;
  public PrdComPer: number | undefined;
  public PrdComAmnt: number | undefined;
  public AddCost: number | undefined;
  public ReferenceNo: string | undefined;
  public ItemFullName: string | undefined;
  public UnitUOM: string | undefined;
  public BoxUOM: string | undefined;
  //extra
  public totalPrice: number | undefined;
  public ShopID: string | undefined;
}
