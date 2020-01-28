import { Routes } from "@angular/router";
import { NotFoundComponent } from "./angular/components/shared/not-found/not-found.component";

export const appRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "analysis"
  },
  {
    path: "**",
    component: NotFoundComponent
  }
];
