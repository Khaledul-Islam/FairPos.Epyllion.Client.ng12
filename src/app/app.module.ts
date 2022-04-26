import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RouteReusableStrategy, ApiPrefixInterceptor, SharedModule } from '@shared';
import { AuthModule } from '@app/auth';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AboutModule } from './about/about.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EnvServiceProvider } from '@env/env.service.provider';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { GrdFilterPipe } from './@shared/GrdFilterPipe';
import { AlertService } from './@shared/AlertService';
import { UserManagementComponent } from './user-management/user-management.component';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
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
import { ItemSelectionSupplierComponent } from './Renu/operations/item-selection-supplier/item-selection-supplier.component';
import { CircularPriceChangeApproveComponent } from './Renu/operations/circular-price-change-approve/circular-price-change-approve.component';
import { ArrivalModalComponent } from './Renu/operations/arrival/arrival-modal/arrival-modal.component';
import { QualityControlComponent } from './Renu/operations/quality-control/quality-control.component';
import { ConversionItemComponent } from './Renu/operations/conversion-item/conversion-item.component';
import { PriceChangeComponent } from './Renu/operations/price-change/price-change.component';
import { ConvModalComponent } from './Renu/operations/conversion-item/conv-modal/conv-modal.component';
import { DamageLossComponent } from './Renu/operations/damage-loss/damage-loss.component';
import { ReturnComponent } from './Renu/operations/return/return.component';
import { DamageModalComponent } from './Renu/operations/damage-loss/damage-modal/damage-modal.component';
import { MainstockToStaffWorkerComponent } from './Renu/transfer/mainstock-to-staff-worker/mainstock-to-staff-worker.component';
import { TransferModalComponent } from './Renu/transfer/mainstock-to-staff-worker/transfer-modal/transfer-modal.component';
import { WorkerToMainStaffComponent } from './Renu/transfer/worker-to-main-staff/worker-to-main-staff.component';
import { StaffToMainWorkerComponent } from './Renu/transfer/staff-to-main-worker/staff-to-main-worker.component';
import { SalesOrderComponent } from './Renu/sales-worker/sales-order/sales-order.component';
import { SalesOrderPrintComponent } from './Renu/sales-worker/sales-order-print/sales-order-print.component';
import { SalesOrderDeliveryComponent } from './Renu/sales-worker/sales-order-delivery/sales-order-delivery.component';
import { VoidSalesComponent } from './Renu/sales-worker/void-sales/void-sales.component';
import { SalesModalWComponent } from './Renu/sales-worker/sales-order/sales-modal-w/sales-modal-w.component';
import { VerifyItemComponent } from './Renu/sales-worker/sales-order-print/verify-item/verify-item.component';
import { VoidSalesStaffComponent } from './Renu/sales-staff/void-sales-staff/void-sales-staff.component';
import { SalesOrderPrintStaffComponent } from './Renu/sales-staff/sales-order-print-staff/sales-order-print-staff.component';
import { SalesOrderDeliveryStaffComponent } from './Renu/sales-staff/sales-order-delivery-staff/sales-order-delivery-staff.component';
import { SalesOrderStaffComponent } from './Renu/sales-staff/sales-order-staff/sales-order-staff.component';
import { VerifyItemStaffComponent } from './Renu/sales-staff/sales-order-print-staff/verify-item-staff/verify-item-staff.component';
import { SalesModalWStaffComponent } from './Renu/sales-staff/sales-order-staff/sales-modal-w-staff/sales-modal-w-staff.component';
import { SoftwareSettingComponent } from './Renu/setups/software-setting/software-setting.component';
import { TopupManagementStaffComponent } from './Renu/setups/topup-management-staff/topup-management-staff.component';
import { MonthlyBudgetComponent } from './Renu/requisition/monthly-budget/monthly-budget.component';
import { AutoRequisitionComponent } from './Renu/requisition/auto-requisition/auto-requisition.component';
import { RequisitionApprovalComponent } from './Renu/requisition/requisition-approval/requisition-approval.component';
import { RequisitionToPurchaseOrderComponent } from './Renu/requisition/requisition-to-purchase-order/requisition-to-purchase-order.component';
import { ArrivalUpdateComponent } from './Renu/operations/arrival-update/arrival-update.component';
import { InventoryComponent } from './Renu/operations/inventory/inventory.component';
import { DiscountComponent } from './Renu/operations/discount/discount.component';
import { PurchaseOrderUpdateComponent } from './Renu/operations/purchase-order-update/purchase-order-update.component';
import { ShopToShopComponent } from './Renu/transfer/shop-to-shop/shop-to-shop.component';
import { RequisitionToPurchaseOrderAllComponent } from './Renu/requisition/requisition-to-purchase-order-all/requisition-to-purchase-order-all.component';
import { RequisitionToPoApprovalComponent } from './Renu/requisition/requisition-to-po-approval/requisition-to-po-approval.component';
import { ManagementStaffTopUpReprintComponent } from './Renu/Report/management-staff-top-up-reprint/management-staff-top-up-reprint.component';
import { TopUpReprintComponent } from './Renu/Report/top-up-reprint/top-up-reprint.component';
import { StockTransferComponent } from './Renu/Report/stock-transfer/stock-transfer.component';
import { TopUpReportComponent } from './Renu/Report/top-up-report/top-up-report.component';
import { StaffBalanceComponent } from './Renu/Report/staff-balance/staff-balance.component';
import { StaffEmailComponent } from './Renu/Report/staff-email/staff-email.component';
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

@NgModule({
  imports: [
    BrowserModule,
    DataTablesModule,
    //ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    RouterModule,
    TranslateModule.forRoot(),
    NgbModule,
    SharedModule,
    ShellModule,
    HomeModule,
    AboutModule,
    NgSelectModule,
    AuthModule,
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
  ],

  declarations: [
    AppComponent,
    NavMenuComponent,
    GrdFilterPipe,
    UserManagementComponent,
    UsersPermissionsComponent,
    ShopListComponent,
    ProductsComponent,
    SupplierComponent,
    EmployeeComponent,
    MeasureUnitComponent,
    ItemsComponent,
    EmployeeItemComponent,
    FamilyCategoryComponent,
    FamilyCategoryLimitComponent,
    ItemsApproveComponent,
    PurchaseOrderComponent,
    ArrivalComponent,
    ItemSelectionSupplierComponent,
    CircularPriceChangeApproveComponent,
    ArrivalModalComponent,
    QualityControlComponent,
    ConversionItemComponent,
    ConvModalComponent,
    PriceChangeComponent,
    DamageLossComponent,
    ReturnComponent,
    DamageModalComponent,
    MainstockToStaffWorkerComponent,
    TransferModalComponent,
    WorkerToMainStaffComponent,
    StaffToMainWorkerComponent,
    SalesOrderComponent,
    SalesOrderPrintComponent,
    SalesOrderDeliveryComponent,
    VoidSalesComponent,
    SalesModalWComponent,
    VerifyItemComponent,
    VoidSalesStaffComponent,
    SalesOrderPrintStaffComponent,
    SalesOrderDeliveryStaffComponent,
    SalesOrderStaffComponent,
    VerifyItemStaffComponent,
    SalesModalWStaffComponent,
    SoftwareSettingComponent,
    TopupManagementStaffComponent,
    MonthlyBudgetComponent,
    AutoRequisitionComponent,
    RequisitionApprovalComponent,
    RequisitionToPurchaseOrderComponent,
    ArrivalUpdateComponent,
    InventoryComponent,
    DiscountComponent,
    PurchaseOrderUpdateComponent,
    ShopToShopComponent,
    RequisitionToPurchaseOrderAllComponent,
    RequisitionToPoApprovalComponent,
    ManagementStaffTopUpReprintComponent,
    TopUpReprintComponent,
    StockTransferComponent,
    TopUpReportComponent,
    StaffBalanceComponent,
    StaffEmailComponent,
    InvoiceReprintComponent,
    SalesOrderReprintComponent,
    SalesReportComponent,
    StockReportComponent,
    PurchaseOrderReportComponent,
    QCReportComponent,
    DamageReportComponent,
    SupplierReturnComponent,
    ReOrderItemComponent,
    ArrivalReportComponent,
    InventoryReportComponent,
    AutoRequisitionReportComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true,
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ErrorHandlerInterceptor,
    //   multi: true,
    // },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy,
    },
    EnvServiceProvider,
    AlertService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
