import { NgModule } from "@angular/core";
import { ConfigOptionComponent } from "./config-option/config-option.component";
import { SharedModule } from "../../shared/shared.module";
import { ConfigComponent } from "./config.component";

@NgModule({
  declarations: [ConfigComponent, ConfigOptionComponent],
  imports: [SharedModule],
  exports: [ConfigComponent]
})
export class ConfigModule {}
