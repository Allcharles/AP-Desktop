import { NgModule } from '@angular/core';
import { MatTableModule, MatPaginatorModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    BrowserModule,
    NgxDatatableModule
  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
    BrowserModule,
    NgxDatatableModule
  ]
})
export class MaterialModule {}
