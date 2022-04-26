import { EmployeeProduct } from './EmployeeProduct';

export class Employee {
  public EmpID: number | undefined;
  public RFCardNo: string | undefined;
  public StaffType: string | undefined;
  public vDesignation: string | undefined;
  public vDesignationBangla: string | undefined;
  public Department: string | undefined;
  public DepartmentBangla: string | undefined;
  public Name: string | undefined;
  public NameBangla: string | undefined;
  public Phone: string | undefined;
  public Email: string | undefined;
  public Unit: string | undefined;
  public FPSEnrollment: number | undefined;
  public FamilyMembers: number | undefined;
  public DiscAllowed: boolean | undefined;
  public IsTransfer: string | undefined;
  public IsCreditAllowed: boolean | undefined;
  public CreditLimit: number | undefined;
  public IsActive: boolean | undefined;
  public UpdateDate: Date | undefined;
  public SpouseId: number | undefined;
  public AvailableLimit: number | undefined;
  public EmpImage: Object | undefined;
  public Balance: number | undefined;
  public AvailableBalance: number | undefined;
  public RecordFilter: number | undefined;
  public RecordCount: number | undefined;
  public LstEmployeeProduct: EmployeeProduct[] | undefined;
}
