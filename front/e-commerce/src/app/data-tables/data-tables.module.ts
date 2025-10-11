import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTablesRoutingModule } from "./data-tables-routing.module";

import { DataTablesComponent } from './data-tables.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { PipeModule } from 'app/shared/pipes/pipe.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NgxSpinnerModule,
        DataTablesRoutingModule,
        NgxDatatableModule,
        PipeModule
    ],
    declarations: [
      DataTablesComponent,
      UserManagementComponent
    ]
})
export class DataTablesModule { }
