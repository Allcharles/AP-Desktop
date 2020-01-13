import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { PageNotFoundComponent } from "./components/";
import { WebviewDirective } from "./directives/";
import { FormsModule } from "@angular/forms";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

const sharedComponents = [NavbarComponent];

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, sharedComponents],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    NgbModule,
    sharedComponents
  ]
})
export class SharedModule {}
