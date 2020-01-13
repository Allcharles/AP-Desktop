import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { NavbarComponent } from "./navbar/navbar.component";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FooterComponent } from "./footer/footer.component";

const sharedComponents = [NavbarComponent, FooterComponent];

@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    sharedComponents
  ]
})
export class SharedModule {}
