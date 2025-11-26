import { Component } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import { ApiService } from '../../services/api-service';
import { NgClass } from '@angular/common';

// ---------------- Member Interface ----------------
export interface MemberModel {
  username: string;
  email: string;
  password: string;
  birthday: string;       // yyyy-MM-dd
  phoneNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  country: string;
  city: string;
  favoris?: number[];     // optional: IDs of favorite events
}
interface MemberCa {
  name: string;
  role: string;
  avatar?: string;
}

// ---------------- Member Component ----------------
@Component({
  selector: 'app-add-member',
  templateUrl: './member.html',
  imports: [
    FormsModule,
    NgClass
],
  styleUrls: ['./member.css'] // corrected
})
export class Member {

  showForm = false;

  member: MemberModel = {
    username: '',
    email: '',
    password: '',
    birthday: '',
    phoneNumber: '',
    gender: 'MALE',
    country: '',
    city: ''
  };

  message = '';
  async ngOnInit() {
    await this.loadMembers();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }


  members: MemberCa[] = [];



  async loadMembers() {
    try {
      const data = await this.api.get<MemberCa[]>('/members');
      this.members = data;
    } catch (error: any) {
      console.error('Erreur chargement membres:', error);
    }
  }

  constructor(private api: ApiService) {}

  async addMember(form: NgForm) {
    if (!form.valid) return;

    try {
      await this.api.post('/members', this.member);
      this.message = 'Member added successfully!';
      form.resetForm();
    } catch (error: any) {
      console.error(error);
      this.message = 'Failed to add member.';
    }
  }
}
