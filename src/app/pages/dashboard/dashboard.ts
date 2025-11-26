import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective, CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent, CalendarDatePipe, DateAdapter, provideCalendar } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ApiService } from '../../services/api-service';
import { NgOptimizedImage } from '@angular/common';

interface Member {
  name: string;
  role: string;
  avatar?: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'], // fixed
  providers: [
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  standalone: true,
  imports: [CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective, CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent, CalendarDatePipe, NgOptimizedImage]
})
export class Dashboard implements OnInit, AfterViewInit {

  eventsCount = 0;
  membersCount = 0;
  guestsCount = 0;
  currentEventsCount = 0;

  constructor(private api: ApiService) {}

  async ngOnInit() {
    await this.loadDashboardData();
    await this.loadMembers();
  }

  ngAfterViewInit() {
    this.animateCounters();
  }

  members: Member[] = [];



  async loadMembers() {
    try {
      const data = await this.api.get<Member[]>('/members');
      this.members = data;
    } catch (error: any) {
      console.error('Erreur chargement membres:', error);
    }
  }

  // Fetch data from backend
  async loadDashboardData() {
    try {
      // Replace endpoints with your actual backend API
      const events = await this.api.get<number>('/events/count');
      const members = await this.api.get<number>('/members/count');
      const guests = await this.api.get<number>('/guests/count');
      //const currentEvents = await this.api.get<number>('/events/current/count');

      this.eventsCount = events;
      this.membersCount = members;
      this.guestsCount = guests;
      //this.currentEventsCount = currentEvents;

      // Start animation after data is loaded
      setTimeout(() => this.animateCounters(), 0);

    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  }

  animateCounters() {
    document.querySelectorAll(".fs-3").forEach(counter => {
      const target = +counter.textContent;
      counter.textContent = "0";
      let current = 0;
      const increment = target / 100;

      const step = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current).toString();
          requestAnimationFrame(step);
        } else {
          counter.textContent = target.toString();
        }
      };

      step();
    });
  }
}
