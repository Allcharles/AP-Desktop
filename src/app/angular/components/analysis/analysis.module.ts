import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { AnalysisComponent } from "./analysis.component";
import { analysisRoutes } from "./analysis.routes";
import { AudioComponent } from "./audio/audio.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { TypeComponent } from "./type/type.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { FolderComponent } from "./folder/folder.component";
import { OutputComponent } from "./output/output.component";
import { AdvancedComponent } from "./advanced/advanced.component";
import { OptionsComponent } from "./options/options.component";
import { ConfigModule } from "./config/config.module";
import { OptionComponent } from './options/option/option.component';

@NgModule({
  declarations: [
    AnalysisComponent,
    TypeComponent,
    AudioComponent,
    FolderComponent,
    ConfirmationComponent,
    NavigationComponent,
    OutputComponent,
    AdvancedComponent,
    OptionsComponent,
    OptionComponent
  ],
  imports: [SharedModule, ConfigModule, RouterModule.forChild(analysisRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AnalysisModule {}
