import { AdvancedComponent } from "./advanced.component";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { OptionComponent } from "./option/option.component";
import { ConfigComponent } from "./config/config.component";

@NgModule({
  declarations: [AdvancedComponent, ConfigComponent, OptionComponent],
  imports: [SharedModule],
  exports: [AdvancedComponent]
})
export class AdvancedModule {}
