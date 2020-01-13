import { SharedModule } from "../shared/shared.module";
import { NgModule } from "@angular/core";
import { AnalysisComponent } from "./analysis.component";

@NgModule({
  declarations: [AnalysisComponent],
  imports: [SharedModule],
  exports: [AnalysisComponent]
})
export class AnalysisModule {}
