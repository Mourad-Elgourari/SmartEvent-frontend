// src/app/pages/add-event/add-event.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-event.html',
  styleUrls: ['./add-event.css'],
})
export class AddEvent {
  @Output() eventCreated = new EventEmitter<any>();

  eventItem = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    visibility: 'PUBLIC',
    type: 'CONFERENCE',
    sponsors: '',
    socialNetwork: 'FACEBOOK',
    status: 'DRAFT',
  };

  dateError = '';

  constructor(private api: ApiService) {}

  async onSubmit() {
    this.dateError = '';

    if (new Date(this.eventItem.startDate) > new Date(this.eventItem.endDate)) {
      this.dateError = 'Start Date cannot be after End Date';
      return;
    }

    try {
      const res = await this.api.post('/events', this.eventItem);
      this.eventCreated.emit(res);
      this.resetForm();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert('Failed to create event');
    }
  }

  resetForm() {
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
    };
    this.dateError = '';
  }
}
