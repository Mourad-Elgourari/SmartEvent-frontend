import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service';
import { AddEvent } from '../add-event/add-event';

// EventItem interface
interface EventItem {
  id?: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  visibility: string;
  type: string;
  sponsors: string;
  socialNetwork: string;
  status: string;
  createdBy?: { username: string };
  organizer?: string;
}

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [NgForOf, NgIf, FormsModule, AddEvent],
  templateUrl: './event.html',
  styleUrls: ['./event.css'],
})
export class Event implements OnInit {
  events: EventItem[] = [];
  showForm = false;
  users: any[] = []; // ✅ define users to store loaded users

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadUsers();
  }
  trackById(index: number, item: EventItem) {
    return item.id;
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  async loadEvents() {
    try {
      const data = await this.api.get<EventItem[]>('/events');
      this.events = data.map((e) => ({
        ...e,
        organizer: e.createdBy?.username || 'Unknown',
      }));
    } catch (err: any) {
      console.error('Failed to load events', err.response?.data || err.message);
    }
  }

  async loadUsers(page: number = 0) {
    try {
      const data = await this.api.get<{ content: any[] }>('/users', { page });
      this.users = data.content;
    } catch (err: any) {
      console.error('Failed to load users', err.response?.data || err.message);
    }
  }

  onEventAdded(newEvent: EventItem) {
    this.events.push({
      ...newEvent,
      organizer: newEvent.createdBy?.username || 'Unknown',
    });
    this.showForm = false;
  }

  async deleteEvent(id?: number) {
    if (!id) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
      await this.api.delete<void>(`/events/${id}`);
      this.events = this.events.filter((e) => e.id !== id);
    } catch (err: any) {
      console.error('Failed to delete event', err.response?.data || err.message);
      alert('Impossible de supprimer cet événement.');
    }
  }
}
