import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataTablesComponent } from './data-tables.component';
import { UserManagementComponent } from './user-management/user-management.component';



const routes: Routes = [
  {
    path: '',
    component: DataTablesComponent,
    data: {
      title: 'DataTable'
    },
  },
  {
    path: 'users',
    component: UserManagementComponent,
    data: {
      title: 'User Management'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataTablesRoutingModule { }
