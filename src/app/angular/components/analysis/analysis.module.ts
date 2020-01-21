import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { AdvancedComponent } from "./advanced/advanced.component";
import { AnalysisComponent } from "./analysis.component";
import { analysisRoutes } from "./analysis.routes";
import { AudioComponent } from "./audio/audio.component";
import { ConfigEditorComponent } from "./config-editor/config-editor.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { FolderComponent } from "./folder/folder.component";
import { OptionsEditorComponent } from "./options-editor/options-editor.component";
import { OutputComponent } from "./output/output.component";
import { TypeComponent } from "./type/type.component";
import { ConfigComponent } from "./config-editor/config/config.component";
import { OptionComponent } from "./options-editor/option/option.component";

const analysisComponents = [
  AdvancedComponent,
  AnalysisComponent,
  AudioComponent,
  ConfigEditorComponent,
  ConfirmationComponent,
  FolderComponent,
  OptionsEditorComponent,
  OutputComponent,
  TypeComponent,
  ConfigComponent,
  OptionComponent
];

@NgModule({
  declarations: [...analysisComponents],
  imports: [SharedModule, RouterModule.forChild(analysisRoutes)],
  exports: [RouterModule, ...analysisComponents],
  providers: []
})
export class AnalysisModule {}
