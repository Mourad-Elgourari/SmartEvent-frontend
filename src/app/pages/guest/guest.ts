import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { QRCodeComponent } from 'angularx-qrcode';
import { ApiService } from '../../services/api-service';

export interface GuestItem {
  id?: number;
  email: string;
  qrCode?: string;
  verified?: boolean;
}

@Component({
  selector: 'app-guest',
  standalone: true,
  imports: [FormsModule, NgClass, QRCodeComponent],
  templateUrl: './guest.html',
  styleUrls: ['./guest.css']
})
export class Guest implements OnInit {
  @ViewChild('badge') badgeElement!: ElementRef;

  showForm = false;
  guests: GuestItem[] = [];
  newGuest: GuestItem = { email: '', verified: false };
  selectedGuest: GuestItem | null = null;
  badgeGenerated = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadGuests();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.newGuest = { email: '', verified: false };
  }

  async loadGuests() {
    try {
      this.guests = await this.api.get<GuestItem[]>('/guests');
    } catch (err: any) {
      console.error('Error fetching guests:', err.response?.data || err.message);
      alert('Could not load guests.');
    }
  }

  async addGuest() {
    if (!this.newGuest.email) {
      alert('Please enter an email.');
      return;
    }

    try {
      const addedGuest = await this.api.post<GuestItem>('/guests', this.newGuest);
      this.guests.push(addedGuest);
      this.newGuest = { email: '', verified: false };
      this.showForm = false;
      alert('Guest added successfully! QR code has been sent to the email.');
    } catch (err: any) {
      console.error('Error adding guest:', err.response?.data || err.message);
      alert('Failed to add guest.');
    }
  }

  async deleteGuest(id: number) {
    if (!confirm('Are you sure you want to delete this guest?')) return;

    try {
      await this.api.delete<void>(`/guests/${id}`);
      this.guests = this.guests.filter(g => g.id! !== id);
    } catch (err: any) {
      console.error('Error deleting guest:', err.response?.data || err.message);
      alert('Failed to delete guest.');
    }
  }

  generateBadge(guest: GuestItem) {
    this.selectedGuest = guest;
    this.badgeGenerated = true;
  }

  get qrData(): string {
    return this.selectedGuest ? JSON.stringify(this.selectedGuest) : '';
  }

  exportAsPDF() {
    if (!this.selectedGuest) return;
    const element = this.badgeElement.nativeElement;

    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [85, 120] });
      const imgWidth = 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 2.5, 5, imgWidth, imgHeight);
      pdf.save(`${this.selectedGuest!.email.replace('@', '_')}_badge.pdf`);
    });
  }
}
