import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { UsersPermissionsComponent } from './users-permissions/users-permissions.component';
import { ShopListComponent } from './Renu/setups/shop-list/shop-list.component';
import { ProductsComponent } from './Renu/setups/products/products.component';
import { SupplierComponent } from './Renu/setups/supplier/supplier.component';

import { MeasureUnitComponent } from './Renu/setups/measure-unit/measure-unit.component';
import { EmployeeComponent } from './Renu/setups/employee-sync/employee-sync.component';
import { ItemsComponent } from './Renu/setups/items/items.component';
import { EmployeeItemComponent } from './Renu/setups/employee-item/employee-item.component';
import { FamilyCategoryComponent } from './Renu/setups/family-category/family-category.component';
import { FamilyCategoryLimitComponent } from './Renu/setups/family-category-limit/family-category-limit.component';
import { ItemsApproveComponent } from './Renu/setups/items-approve/items-approve.component';
import { PurchaseOrderComponent } from './Renu/operations/purchase-order/purchase-order.component';
import { ArrivalComponent } from './Renu/operations/arrival/arrival.component';
import { CircularPriceChangeApproveComponent } from './Renu/operations/circular-price-change-approve/circular-price-change-approve.component';
import { QualityControlComponent } from './Renu/operations/quality-control/quality-control.component';
import { ConversionItemComponent } from './Renu/operations/conversion-item/conversion-item.component';
import { PriceChangeComponent } from './Renu/operations/price-change/price-change.component';
import { DamageLossComponent } from './Renu/operations/damage-loss/damage-loss.component';
import { ReturnComponent } from './Renu/operations/return/return.component';
import { MainstockToStaffWorkerComponent } from './Renu/transfer/mainstock-to-staff-worker/mainstock-to-staff-worker.component';
import { WorkerToMainStaffComponent } from './Renu/transfer/worker-to-main-staff/worker-to-main-staff.component';
import { StaffToMainWorkerComponent } from './Renu/transfer/staff-to-main-worker/staff-to-main-worker.component';
import { SalesOrderComponent } from './Renu/sales-worker/sales-order/sales-order.component';
import { SalesOrderDeliveryComponent } from './Renu/sales-worker/sales-order-delivery/sales-order-delivery.component';
import { SalesOrderPrintComponent } from './Renu/sales-worker/sales-order-print/sales-order-print.component';
import { VoidSalesComponent } from './Renu/sales-worker/void-sales/void-sales.component';
import { SalesOrderStaffComponent } from './Renu/sales-staff/sales-order-staff/sales-order-staff.component';
import { SalesOrderPrintStaffComponent } from './Renu/sales-staff/sales-order-print-staff/sales-order-print-staff.component';
import { SalesOrderDeliveryStaffComponent } from './Renu/sales-staff/sales-order-delivery-staff/sales-order-delivery-staff.component';
import { VoidSalesStaffComponent } from './Renu/sales-staff/void-sales-staff/void-sales-staff.component';
import { SoftwareSettingComponent } from './Renu/setups/software-setting/software-setting.component';
import { TopupManagementStaffComponent } from './Renu/setups/topup-management-staff/topup-management-staff.component';
import { MonthlyBudgetComponent } from './Renu/requisition/monthly-budget/monthly-budget.component';
import { AutoRequisitionComponent } from './Renu/requisition/auto-requisition/auto-requisition.component';
import { RequisitionApprovalComponent } from './Renu/requisition/requisition-approval/requisition-approval.component';
import { RequisitionToPurchaseOrderComponent } from './Renu/requisition/requisition-to-purchase-order/requisition-to-purchase-order.component';
import { ArrivalUpdateComponent } from './Renu/operations/arrival-update/arrival-update.component';
import { DiscountComponent } from './Renu/operations/discount/discount.component';
import { InventoryComponent } from './Renu/operations/inventory/inventory.component';
import { PurchaseOrderUpdateComponent } from './Renu/operations/purchase-order-update/purchase-order-update.component';
import { ShopToShopComponent } from './Renu/transfer/shop-to-shop/shop-to-shop.component';
import { RequisitionToPurchaseOrderAllComponent } from './Renu/requisition/requisition-to-purchase-order-all/requisition-to-purchase-order-all.component';
import { RequisitionToPoApprovalComponent } from './Renu/requisition/requisition-to-po-approval/requisition-to-po-approval.component';
import { InvoiceReprintComponent } from './Renu/Report/invoice-reprint/invoice-reprint.component';
import { SalesOrderReprintComponent } from './Renu/Report/sales-order-reprint/sales-order-reprint.component';
import { SalesReportComponent } from './Renu/Report/sales-report/sales-report.component';
import { StockReportComponent } from './Renu/Report/stock-report/stock-report.component';
import { PurchaseOrderReportComponent } from './Renu/Report/purchase-order-report/purchase-order-report.component';
import { QCReportComponent } from './Renu/Report/qcreport/qcreport.component';
import { DamageReportComponent } from './Renu/Report/damage-report/damage-report.component';
import { SupplierReturnComponent } from './Renu/Report/supplier-return/supplier-return.component';
import { ReOrderItemComponent } from './Renu/Report/re-order-item/re-order-item.component';
import { ArrivalReportComponent } from './Renu/Report/arrival-report/arrival-report.component';
import { InventoryReportComponent } from './Renu/Report/inventory-report/inventory-report.component';
import { AutoRequisitionReportComponent } from './Renu/Report/auto-requisition-report/auto-requisition-report.component';
import { StockTransferComponent } from './Renu/Report/stock-transfer/stock-transfer.component';
import { TopUpReprintComponent } from './Renu/Report/top-up-reprint/top-up-reprint.component';
import { TopUpReportComponent } from './Renu/Report/top-up-report/top-up-report.component';
import { StaffBalanceComponent } from './Renu/Report/staff-balance/staff-balance.component';
import { StaffEmailComponent } from './Renu/Report/staff-email/staff-email.component';

const routes: Routes = [
  // Fallback when no prior route is matched
  { path: 'user-management', component: UserManagementComponent, data: { title: marker('User Management') } },
  { path: 'userpermission', component: UsersPermissionsComponent, data: { title: marker('User Permission') } },
  { path: 'setups/shop-list', component: ShopListComponent, data: { title: marker('Shop List') } },
  { path: 'setups/product-list', component: ProductsComponent, data: { title: marker('Product List') } },
  { path: 'setups/supplier-list', component: SupplierComponent, data: { title: marker('Supplier List') } },
  { path: 'setups/employeesync', component: EmployeeComponent, data: { title: marker('Employee List') } },
  { path: 'setups/measureUnit', component: MeasureUnitComponent, data: { title: marker('Measure Unit') } },
  { path: 'setups/items', component: ItemsComponent, data: { title: marker('Item') } },
  { path: 'setups/employee-item', component: EmployeeItemComponent, data: { title: marker('Employee Item') } },
  { path: 'setups/family-category', component: FamilyCategoryComponent, data: { title: marker('Family Category') } },
  {
    path: 'setups/family-category-limit',
    component: FamilyCategoryLimitComponent,
    data: { title: marker('Family Category Limit') },
  },
  { path: 'setups/items-approve', component: ItemsApproveComponent, data: { title: marker('Items Approve') } },
  { path: 'setups/software-setting', component: SoftwareSettingComponent, data: { title: marker('software-setting') } },
  {
    path: 'setups/managementstaff-topup',
    component: TopupManagementStaffComponent,
    data: { title: marker('Topup Management Staff Component') },
  },

  { path: 'operations/purchase-order', component: PurchaseOrderComponent, data: { title: marker('Purchase Order') } },
  {
    path: 'operations/purchase-order-update',
    component: PurchaseOrderUpdateComponent,
    data: { title: marker('Purchase Order Edit') },
  },
  { path: 'operations/arrival', component: ArrivalComponent, data: { title: marker('Arrival') } },
  { path: 'operations/arrival-update', component: ArrivalUpdateComponent, data: { title: marker('Arrival Edit') } },
  {
    path: 'operations/circular-price-change-approve',
    component: CircularPriceChangeApproveComponent,
    data: { title: marker('Circular Price Change Approve') },
  },
  {
    path: 'operations/quality-control',
    component: QualityControlComponent,
    data: { title: marker('Quality Control') },
  },
  {
    path: 'operations/conversion-item',
    component: ConversionItemComponent,
    data: { title: marker('Conversion Item') },
  },
  { path: 'operations/price-change', component: PriceChangeComponent, data: { title: marker('Price Change') } },
  { path: 'operations/damage-loss', component: DamageLossComponent, data: { title: marker('Damage Loss') } },
  { path: 'operations/return', component: ReturnComponent, data: { title: marker('Return') } },
  { path: 'operations/discount', component: DiscountComponent, data: { title: marker('Discount') } },
  { path: 'operations/inventory', component: InventoryComponent, data: { title: marker('Inventory') } },

  {
    path: 'transfer/mainstock-to-staff-worker',
    component: MainstockToStaffWorkerComponent,
    data: { title: marker('MainToStaffWorker') },
  },
  {
    path: 'transfer/worker-to-main-staff',
    component: WorkerToMainStaffComponent,
    data: { title: marker('WorkerToMainStaff') },
  },
  {
    path: 'transfer/staff-to-main-worker',
    component: StaffToMainWorkerComponent,
    data: { title: marker('StaffToMainWorker') },
  },
  { path: 'transfer/shop-to-shop', component: ShopToShopComponent, data: { title: marker('ShopToShop') } },

  { path: 'sales/sales-order', component: SalesOrderComponent, data: { title: marker('SalesOrder') } },
  { path: 'sales/sales-order-print', component: SalesOrderPrintComponent, data: { title: marker('SalesOrderPrint') } },
  {
    path: 'sales/sales-order-delivery',
    component: SalesOrderDeliveryComponent,
    data: { title: marker('SalesOrderDelivery') },
  },
  { path: 'sales/void-sales', component: VoidSalesComponent, data: { title: marker('VoidSales') } },

  { path: 'sales/sales-order-staff', component: SalesOrderStaffComponent, data: { title: marker('SalesOrder') } },
  {
    path: 'sales/sales-order-print-staff',
    component: SalesOrderPrintStaffComponent,
    data: { title: marker('SalesOrderPrint') },
  },
  {
    path: 'sales/sales-order-delivery-staff',
    component: SalesOrderDeliveryStaffComponent,
    data: { title: marker('SalesOrderDelivery') },
  },
  { path: 'sales/void-sales-staff', component: VoidSalesStaffComponent, data: { title: marker('VoidSales') } },

  { path: 'requisition/monthly-budget', component: MonthlyBudgetComponent, data: { title: marker('MonthlyBudget') } },
  {
    path: 'requisition/auto-requisition',
    component: AutoRequisitionComponent,
    data: { title: marker('AutoRequisition') },
  },
  {
    path: 'requisition/requisition-approval',
    component: RequisitionApprovalComponent,
    data: { title: marker('Requisition Approval') },
  },
  {
    path: 'requisition/requisition-to-purchase-order',
    component: RequisitionToPurchaseOrderComponent,
    data: { title: marker('Requisition To Purchase Order') },
  },
  {
    path: 'requisition/requisition-to-purchase-order-approval',
    component: RequisitionToPoApprovalComponent,
    data: { title: marker('Requisition To Purchase Order Approval') },
  },
  {
    path: 'requisition/requisition-to-purchase-order-all',
    component: RequisitionToPurchaseOrderAllComponent,
    data: { title: marker('Requisition To Purchase Order All') },
  },

  //ReportSection
  { path: 'report/invoice-reprint', component: InvoiceReprintComponent, data: { title: marker('Invoice Reprint') } },
  {
    path: 'report/sales-order-reprint',
    component: SalesOrderReprintComponent,
    data: { title: marker('Sales Order Reprint') },
  },
  { path: 'report/sales-report', component: SalesReportComponent, data: { title: marker('Sales Report') } },
  { path: 'report/stock-report', component: StockReportComponent, data: { title: marker('Stock Report') } },
  {
    path: 'report/purchase-order-report',
    component: PurchaseOrderReportComponent,
    data: { title: marker('Purchase Order Report') },
  },
  { path: 'report/QC-report', component: QCReportComponent, data: { title: marker('QC Report') } },
  { path: 'report/damage-report', component: DamageReportComponent, data: { title: marker('Damage Report') } },
  {
    path: 'report/supplier-return-report',
    component: SupplierReturnComponent,
    data: { title: marker('Supplier Return Report') },
  },
  {
    path: 'report/re-order-item-report',
    component: ReOrderItemComponent,
    data: { title: marker('ReOrder Item Report') },
  },
  { path: 'report/arrival-report', component: ArrivalReportComponent, data: { title: marker('Arrival Report') } },
  { path: 'report/inventory-report', component: InventoryReportComponent, data: { title: marker('Inventory Report') } },
  {
    path: 'report/auto-requisition-report',
    component: AutoRequisitionReportComponent,
    data: { title: marker('Auto Requisition Report') },
  },
  {
    path: 'report/stock-transfer-report',
    component: StockTransferComponent,
    data: { title: marker('Stock Transfer Report') },
  },
  { path: 'report/topup-reprint', component: TopUpReprintComponent, data: { title: marker('TopUP Reprint') } },
  { path: 'report/topup-report', component: TopUpReportComponent, data: { title: marker('TopUP Report') } },
  {
    path: 'report/staff-balance-report',
    component: StaffBalanceComponent,
    data: { title: marker('Staff Balance Report') },
  },
  { path: 'report/staff-email-report', component: StaffEmailComponent, data: { title: marker('Staff Email Report') } },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
