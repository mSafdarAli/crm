import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  menu: boolean = true;
  constructor(@Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,) { }

  ngOnInit(): void {
  }

  showMenu() {
    if (this.document.body.classList.contains('sidebar-enable')) {
      this.renderer.removeClass(this.document.body, 'sidebar-enable');
    } else {
      this.renderer.addClass(this.document.body, 'sidebar-enable');
    }
  }
}
