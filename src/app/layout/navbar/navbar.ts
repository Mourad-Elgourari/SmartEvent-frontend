import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import {Auth} from '../../auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [NgClass],
  styleUrls: ['./navbar.css']
})
export class Navbar {
  @Output() toggleSidebar = new EventEmitter<void>();
  sidebarOpen = true; // track sidebar state

  constructor(private auth: Auth, private router: Router) {}

  onToggle() {
    // Emit event to parent if needed
    this.toggleSidebar.emit();

    // Toggle sidebar visibility
    this.sidebarOpen = !this.sidebarOpen;

    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('d-none', !this.sidebarOpen);
    }
  }

  logout() {
    // Remove token from localStorage
    this.auth.logout();

    // Redirect to login page
    this.router.navigate(['/home']);
  }
}
