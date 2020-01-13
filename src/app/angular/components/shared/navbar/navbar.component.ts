import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  public isMenuCollapsed = true;

  constructor() {}

  ngOnInit(): void {}
}
