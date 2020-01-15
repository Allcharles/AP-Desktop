import { AdvancedComponent } from "./advanced.component";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { ConfigOptionComponent } from "./config-option/config-option.component";
import { OptionComponent } from "./option/option.component";

@NgModule({
  declarations: [AdvancedComponent, ConfigOptionComponent, OptionComponent],
  imports: [SharedModule],
  exports: [AdvancedComponent]
})
export class AdvancedModule {}
