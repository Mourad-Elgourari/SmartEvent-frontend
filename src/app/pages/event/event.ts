import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service';
import { AddEvent, EventItem } from '../add-event/add-event';

interface MemberCa {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [FormsModule, AddEvent],
  templateUrl: './event.html',
  styleUrls: ['./event.css'],
})
export class Event implements OnInit {
  events: EventItem[] = [];
  showForm = false;
  members: MemberCa[] = []; // store all members for name lookup

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadEvents();
    this.loadMembers();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  async loadMembers() {
    try {
      const data = await this.api.get<MemberCa[]>('/members');
      this.members = data;
    } catch (err) {
      console.error(err);
    }
  }

  async loadEvents() {
    try {
      const data = await this.api.get<EventItem[]>('/events');
      this.events = data;
    } catch (err) {
      console.error(err);
    }
  }

  onEventAdded(newEvent: EventItem) {
    this.events.push(newEvent);
    this.showForm = false;
  }

  // Helper: get organizer names from IDs
  getOrganizerNames(ids: number[]): string {
    if (!ids || !this.members.length) return '-';
    return ids
      .map(id => this.members.find(m => m.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }

  async deleteEvent(id?: number) {
    if (!id) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
      await this.api.delete<void>(`/events/${id}`);
      this.events = this.events.filter((e) => e.id !== id);
    } catch (err) {
      console.error(err);
      alert('Impossible de supprimer cet événement.');
    }
  }
}
