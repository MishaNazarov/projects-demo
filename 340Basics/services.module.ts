import {NgModule} from '@angular/core';
import {MessageService} from '@progress/kendo-angular-l10n';
import {CopayCalculatorService} from './copay-calculator.service';
import {EntitiesService} from './contracts/entities.service';
import {PharmaciesService} from './contracts/pharmacies.service';
import {PharmacyChainsService} from './contracts/pharmacy-chains.service';
import {GridMessageService} from './components/messages/grid-message.service';
import {ModelParsingService} from './common/model-parsing.service';
import {PatientsService} from './eligibility/patients.service';
import {LocationsService} from './eligibility/locations.service';
import {ProvidersService} from './eligibility/providers.service';
import {ClaimsService} from './eligibility/claims.service';
import {ReportsService} from './reports/reports.service';
import {DataImportService} from './administration/data-import.service';
import {CompanyDetailsService} from './administration/company-details.service';
import {AchAccountsService} from './administration/ach-accounts.service';
import {CarveOutService} from './administration/carve-out.service';
import {FplService} from './administration/fpl.service';
import {PharmacyInventoryService} from './virtual-inventory/pharmacy-inventory.service';
import {MasterPriceFileService} from './virtual-inventory/master-price-file.service';
import {PurchaseOrderService} from './virtual-inventory/purchase-order.service';
import {PurchaseOrderCflService} from './virtual-inventory/purchase-order-cfl.service';
import {PharmacyChainsInventoryService} from './virtual-inventory/pharmacy-chains.service';
import {PriceFilesService} from './virtual-inventory/price-files.service';
import {HistoryLogsService} from './user-menu/history-logs.service';
import {ManageUsersService} from './user-menu/manage-users.service';
import {ProfileService} from './user-menu/profile.service';
import {DashBoardService} from './dashBoard.service';
import { InvoicesService } from './contracts/invoices.service';

@NgModule({
  imports: [],
  providers: [
    CopayCalculatorService,
    EntitiesService,
    PharmaciesService,
    PharmacyChainsService,
    ModelParsingService,
    PatientsService,
    ReportsService,
    LocationsService,
    InvoicesService,
    ProvidersService,
    CompanyDetailsService,
    DataImportService,
    ClaimsService,
    AchAccountsService,
    CarveOutService,
    FplService,
    MasterPriceFileService,
    PharmacyInventoryService,
    PurchaseOrderService,
    PurchaseOrderCflService,
    PharmacyChainsInventoryService,
    PriceFilesService,
    DashBoardService,
    HistoryLogsService,
    ManageUsersService,
    ProfileService,
    {provide: MessageService, useClass: GridMessageService}
  ],
})

export class ServicesModule {
}
