import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import {Auth} from '../../auth';

interface SidebarLink {
  title: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar implements OnInit {
  @Input() collapsed = false;
  user: any = null;

  links: SidebarLink[] = [
    { title: 'Dashboard', icon: 'bi-speedometer2', route: '/dashboard' },
    { title: 'Users', icon: 'bi-person', route: '/users' },
    { title: 'Members', icon: 'bi-person', route: '/members' },
    { title: 'Guests', icon: 'bi-person', route: '/guests' },
    { title: 'Badge', icon: 'bi bi-qr-code', route: '/badge' },
    { title: 'Event', icon: 'bi bi-table', route: '/event' },

  ];



  constructor(private auth: Auth, private cd: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      let rawUser: any = null;
      const stored = localStorage.getItem('user');

      if (stored && stored !== 'undefined') {
        rawUser = JSON.parse(stored);
      }

      this.user = rawUser;

      if (!this.user && this.auth.getToken()) {
        this.user = await this.auth.fetchUser();
        this.cd.detectChanges();
      }
    } catch (err) {
      console.error('Failed to load user:', err);
      this.user = null;
    }
  }

}
