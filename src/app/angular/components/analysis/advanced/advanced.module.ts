import { AdvancedComponent } from "./advanced.component";
import { NgModule } from "@angular/core";
import { ConfigComponent } from "./config/config.component";
import { OptionsComponent } from "./options/options.component";
import { SharedModule } from "../../shared/shared.module";
import { ConfigOptionComponent } from "./config-option/config-option.component";
import { OptionComponent } from "./option/option.component";

@NgModule({
  declarations: [
    AdvancedComponent,
    ConfigComponent,
    ConfigOptionComponent,
    OptionsComponent,
    OptionComponent
  ],
  imports: [SharedModule],
  exports: [AdvancedComponent]
})
export class AdvancedModule {}
