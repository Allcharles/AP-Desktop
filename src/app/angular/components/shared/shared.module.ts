import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { NotFoundComponent } from "./not-found/not-found.component";

const sharedComponents = [NavbarComponent, FooterComponent, NotFoundComponent];

@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule,
    sharedComponents
  ]
})
export class SharedModule {}
