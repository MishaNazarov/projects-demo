import { Component, OnInit, OnDestroy } from '@angular/core';
import { IMyDrpOptions, IMyDateRangeModel, IMyDateRange } from 'mydaterangepicker';
import { Observable } from 'rxjs/Observable';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { GridConfiguration, UpdateGridConfigurationAction } from '../../../shared/store/grids';
import { Claim } from '../../../shared/models/Claim';
import { ClaimsService } from '../../../shared/services/eligibility/claims.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../shared/store/state';
import { Subscription } from 'rxjs/Subscription';
import { ClientPharmacy } from '../../../shared/models/ClientPharmacy';
import {
  ComboBoxQuery,
  DefaultComboBoxQuery
} from '../../../shared/components/pageable-combobox/pageable-combobox.model';
import * as FileSaver from 'file-saver';
import { defaultPagerSettings, excelMimeTypes } from '../../../shared/constants';
import { HTMLInputEvent } from '../../../shared/interfaces';
import { ToastsManager } from 'ng2-toastr';
import { CustomToastErrorOption } from '../../../custom-toast-option'
import { Action } from '../../../shared/models/Action';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})

export class ClaimsComponent implements OnInit, OnDestroy {
  private gridConfigurationSubscribe: Subscription;
  private activeClientSubscription: Subscription;
  private claimsSubscription: Subscription;
  private idClient: number;
  public loading: boolean;
  public gridConfiguration: GridConfiguration<Claim>;
  public claimsList: GridDataResult;
  public pharmaciesList$: Observable<Array<ClientPharmacy>> | undefined = undefined;
  public pharmaciesLoading = false;
  public pharmaciesTotal = 0;
  public pageable = defaultPagerSettings;

  public downloading: boolean;
  public uploading: boolean;
  public applyingOverrides: boolean;

  public dateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '30px'
  };

  constructor(private claimsService: ClaimsService,
    private toastr: ToastsManager,
    private store: Store<AppState>) {
  }

  public applyOverrides() {
    this.applyingOverrides = true;

    this.claimsService.applyOverrides(this.claimsList.data, this.idClient).then((response) => {
      this.applyingOverrides = false;
      if (response.size > 0) {
        FileSaver.saveAs(response, 'Claims.xlsx');
      } else {
        this.toastr.success('All claims have been reprocessed.');
        this.loadClaims();
      }
    }).catch((error) => {
      this.applyingOverrides = false;
      this.toastr.error(error.error.error.message, '', CustomToastErrorOption);
    });

  }

  public download() {
    this.downloading = true;
    this.claimsService.export(this.gridConfiguration).then(response => {
      FileSaver.saveAs(response, 'Claims.xlsx');
      this.downloading = false;
    }).catch(error => {
      this.toastr.error(error, '', CustomToastErrorOption);
      this.downloading = false;
    });
  }

  public upload(event: HTMLInputEvent) {
    const fileList: FileList | null = event.target.files;
    if (fileList && fileList.length > 0) {
      const file: File = fileList[0];
      if (excelMimeTypes.indexOf(file.type) === -1) {
        this.toastr.warning('Wrong file type');
        return;
      }
      this.uploading = true;
      const fileData = new FormData();
      fileData.append('File', file, file.name);
      this.claimsService.applyOverridersBatch(this.idClient, fileData).then(() => {
        this.toastr.success('The file was successfully uploaded.');
        this.uploading = false;
      }).catch((error) => {
        this.toastr.error(error.error.error.message, '', CustomToastErrorOption);
        this.uploading = false;
      });
    }
  }

  public pageChange(event: PageChangeEvent): void {
    this.gridConfiguration.skip = event.skip;
    this.gridConfiguration.take = event.take;
    this.loadClaims();
  }

  public loadClaims() {
    this.loading = true;

    this.claimsSubscription = this.claimsService.loadClaims(this.gridConfiguration).map((response) => {
      this.loading = false;
      return {
        data: response.value.map(c => {
          const defautAction = c.AvailableActions.find(a => a.IsDefault);
          c.Action = defautAction ? defautAction.Action : Action.None;
          return c;
        }),
        total: response['@odata.count']
      };
    }).subscribe(x => {
      this.claimsList = x;
    });

    this.store.dispatch(new UpdateGridConfigurationAction(this.gridConfiguration, 'patients'));
  }

  public pharmacyOnSelect(value: ClientPharmacy) {
    this.gridConfiguration.skip = 0;
    if (value) {
      this.gridConfiguration.filter.IDClientPharmacy = value.IDClientPharmacy;
    } else {
      this.gridConfiguration.filter.IDClientPharmacy = undefined;
    }
  }

  public dateFromToChanged(dateRange: IMyDateRangeModel) {
    this.gridConfiguration.filter.TimeStampFrom = dateRange.beginJsDate;
    this.gridConfiguration.filter.TimeStampTo = dateRange.endJsDate;
  }

  public reprocessDateFromToChanged(dateRange: IMyDateRangeModel) {
    this.gridConfiguration.filter.LastRemappingTimestampFrom = dateRange.beginJsDate;
    this.gridConfiguration.filter.LastRemappingTimestampTo = dateRange.endJsDate;
  }

  public loadPharmacies(query: ComboBoxQuery = DefaultComboBoxQuery) {
    this.pharmaciesLoading = true;

    this.pharmaciesList$ = this.claimsService.loadPharmacies(query.filter, query.take, this.idClient)
      .map((response) => {
        this.pharmaciesLoading = false;
        this.pharmaciesTotal = response['@odata.count'];
        return response.value;
      });
  }

  public ngOnInit() {
    this.gridConfigurationSubscribe = this.store
      .select(state => state.grids.claims)
      .subscribe(config => {
        this.gridConfiguration = config;
      });

    this.activeClientSubscription = this.store
      .select(state => state.globalClients.activeClient)
      .subscribe(activeClient => {
        if (activeClient.IDClient) {
          this.idClient = activeClient.IDClient;
          this.gridConfiguration.filter.IDClient = activeClient.IDClient;
          this.gridConfiguration.filter.IDClientPharmacy = undefined;
          this.gridConfiguration.skip = 0;
          this.loadPharmacies();
          this.loadClaims();
        }
      });
  }

  public ngOnDestroy() {
    this.gridConfigurationSubscribe.unsubscribe();
    this.activeClientSubscription.unsubscribe();
    if (this.claimsSubscription) {
      this.claimsSubscription.unsubscribe();
    }
  }

}
