import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  expandNav = false;
  outputEnabled = true;

  constructor() {}

  ngOnInit() {}

  toggleNav() {
    this.expandNav = !this.expandNav;
  }
}
