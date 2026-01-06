import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ApiService } from '../../services/api-service';

export interface MemberCa {
  id: number;
  name: string;
  role: string;
}

export interface EventItem {
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
  organizers: number[];
}

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './add-event.html',
  styleUrls: ['./add-event.css'],
})
export class AddEvent implements OnInit {
  members: MemberCa[] = [];
  organizers: number[] = [];
  dateError: string | undefined;

  @Output() eventCreated = new EventEmitter<EventItem>();

  eventItem: EventItem = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    visibility: 'PUBLIC',
    type: 'CONFERENCE',
    sponsors: '',
    socialNetwork: 'FACEBOOK',
    status: 'DRAFT',
    organizers: [],
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadMembers();
  }

  async loadMembers() {
    try {
      const data = await this.api.get<MemberCa[]>('/members');
      this.members = data.length ? data : [{ id: 0, name: 'No members available', role: '' }];
    } catch (err) {
      console.error(err);
      this.members = [{ id: 0, name: 'No members available', role: '' }];
    }
  }

  async onSubmit() {
    this.dateError = '';
    if (new Date(this.eventItem.startDate) > new Date(this.eventItem.endDate)) {
      this.dateError = 'Start Date cannot be after End Date';
      return;
    }

    this.eventItem.organizers = this.organizers;

    try {
      const savedEvent = await this.api.post<EventItem>('/events', this.eventItem);
      console.log('Event saved', savedEvent);
      this.eventCreated.emit(savedEvent);

      // Reset form
      this.eventItem = {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        visibility: 'PUBLIC',
        type: 'CONFERENCE',
        sponsors: '',
        socialNetwork: 'FACEBOOK',
        status: 'DRAFT',
        organizers: [],
      };
      this.organizers = [];
    } catch (err) {
      console.error('Failed to save event', err);
    }
  }
}
