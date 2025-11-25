import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Home } from './pages/home/home';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { AuthGuard } from './auth-guard';
import { Dashboard } from './pages/dashboard/dashboard';
import {Users} from './pages/users/users';
import {Guest} from './pages/guest/guest';
import {Badge} from './pages/badge/badge';
import {Event} from './pages/event/event';
import {Member} from './pages/member/member';

export const routes: Routes = [
  // Public routes
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Protected routes inside layout
  {
    path: '',
    component: DashboardLayout,
    canActivate: [AuthGuard],
    children: [

      { path: 'dashboard', component: Dashboard, data: { title: 'Dashboard' } },
      { path: 'users', component: Users, data: { title: 'Users' } },
      { path: 'members', component: Member, data: { title: 'Member' } },
      { path: 'guests', component: Guest, data: { title: 'Guests' } },
      { path: 'badge', component: Badge, data: { title: 'Badge' } },
      { path: 'event', component: Event, data: { title: 'Event' } }
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'dashboard' },
];
