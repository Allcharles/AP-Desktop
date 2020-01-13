import { Injectable } from "@angular/core";
import { AnalysisType } from "../../models/analysis";
import { analysisTypes } from "../../models/analysisTypes";
import { ElectronService } from "../electron/electron.service";

@Injectable({
  providedIn: "root"
})
export class APService extends ElectronService {
  constructor() {
    super();
  }

  getAnalysisTypes(): AnalysisType[] {
    if (!this.isElectron) {
      return [];
    }

    return analysisTypes;
  }
}
