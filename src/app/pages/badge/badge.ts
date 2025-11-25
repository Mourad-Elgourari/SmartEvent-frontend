import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {ApiService} from '../../services/api-service';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeComponent],
  templateUrl: './badge.html',
  styleUrls: ['./badge.css'],
})
export class Badge implements OnInit {
  @ViewChild('badge') badgeElement!: ElementRef;

  users: any[] = [];
  selectedUser: any = null;
  badgeGenerated = false;

  constructor(private api: ApiService) { }

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers(page: number = 0) {
    try {
      const data = await this.api.get<{ content: any[] }>('/users', { page });
      this.users = data.content;
    } catch (err: any) {
      console.error('Failed to load users', err.response?.data || err.message);
    }
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.badgeGenerated = true; // show badge
  }

  get qrData(): string {
    return this.selectedUser ? JSON.stringify(this.selectedUser) : '';
  }

  exportAsPDF() {
    if (!this.selectedUser) return;

    const element = this.badgeElement.nativeElement;

    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [85, 120],
      });

      const imgWidth = 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 2.5, 5, imgWidth, imgHeight);
      pdf.save(`${this.selectedUser.username.replace(' ', '_')}_badge.pdf`);
    });
  }
}
