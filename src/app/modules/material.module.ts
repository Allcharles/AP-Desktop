import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule
  ],
  exports: [
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule
  ]
})
export class MaterialModule { }
