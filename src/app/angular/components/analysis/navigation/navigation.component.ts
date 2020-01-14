import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-analysis-nav",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"]
})
export class NavigationComponent implements OnInit {
  @Input() disabledBack = false;
  @Input() isValid: boolean;
  @Output() back = new EventEmitter<any>();
  @Output() next = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  goBack(): void {
    this.back.emit();
  }

  goNext(): void {
    this.next.emit();
  }
}
