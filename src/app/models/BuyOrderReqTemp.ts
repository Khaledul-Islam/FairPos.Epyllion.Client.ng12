export class BuyOrderReqTemp {
  public CmpIDX: string | undefined;
  public Chln: string | undefined;
  public SupID: string | undefined;
  public sBarCode: string | undefined;
  public BarCode: string | undefined;
  public BoxQty: number | undefined;
  public Qty: number | undefined;
  public sQty: number | undefined;
  public DiscPrcnt: number | undefined;
  public VATPrcnt: number | undefined;
  public PrdComm: number | undefined;
  public CPU: number | undefined;
  public RPU: number | undefined;
  public CRPU: number | undefined;
  public BuyDT: Date | undefined;
  public EXPDT: Date | undefined;
  public UserID: string | undefined;
  public PrdDescription: string | undefined;
  public BoxUOM: string | undefined;
  public UnitUOM: string | undefined;
  public DeliveryDate: Date | undefined;
  public PrdID: string | undefined;
  public POPackQty: number | undefined;
  public PackUOM: string | undefined;
  public ReqChlnNo: string | undefined;
  public ShopID: string | undefined;
  //
  public ischeck: boolean | undefined;
  public PartialDelivery: boolean | undefined;
  public PaymentTerms: string | undefined;
  public MaturtyDays: string | undefined;
  public QutRefNo: string | undefined;
  public enabled = false;
}
