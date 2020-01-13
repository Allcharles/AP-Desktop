import { SharedModule } from "../shared/shared.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AnalysisComponent } from "./analysis.component";

@NgModule({
  declarations: [AnalysisComponent],
  imports: [CommonModule, SharedModule],
  exports: [AnalysisComponent]
})
export class AnalysisModule {}
