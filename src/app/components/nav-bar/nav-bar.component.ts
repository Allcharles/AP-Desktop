import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Input() active: string;

  expandNav = false;
  outputEnabled = true;

  constructor() {}

  ngOnInit() {}

  toggleNav() {
    this.expandNav = !this.expandNav;
  }

  isActive(tab: string): string {
    return this.active === tab ? 'active' : '';
  }
}
