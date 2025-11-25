import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service'; // universal service

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.html',
  imports: [RouterLink, NgForOf, NgIf, FormsModule, NgClass],
  styleUrls: ['./users.css']
})
export class Users implements OnInit {
  users: any[] = [];
  currentPage = 0;
  totalPages = 0;
  showForm = false;

  newUser = {
    username: '',
    email: '',
    password: '',
    roles: [] as string[]
  };

  roleUser = false;
  roleAdmin = false;

  deleteError: string = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(page: number = 0) {
    try {
      const data = await this.api.get<{ content: any[]; number: number; totalPages: number }>('/users', { page, size: 10 });
      this.users = data.content;
      this.currentPage = data.number;
      this.totalPages = data.totalPages;
    } catch (error: any) {
      console.error('Erreur chargement utilisateurs:', error);
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  async addUser() {
    const roles: string[] = [];
    if (this.roleUser) roles.push('USER');
    if (this.roleAdmin) roles.push('ADMIN');

    const payload = {
      username: this.newUser.username,
      email: this.newUser.email,
      password: this.newUser.password,
      roles
    };

    try {
      await this.api.post('/users', payload);
      this.newUser = { username: '', email: '', password: '', roles: [] };
      this.roleUser = this.roleAdmin = false;
      this.showForm = false;
      this.loadUsers(this.currentPage);
    } catch (error: any) {
      console.error('Erreur backend:', error.response?.data || error.message);
      alert('Échec de l’ajout de l’utilisateur.');
    }
  }

  async deleteUser(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    this.deleteError = '';
    try {
      await this.api.delete(`/users/${id}`);
      this.loadUsers(this.currentPage);
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      this.deleteError = 'Impossible de supprimer cet utilisateur car il est encore associé à des rôles ou d’autres données.';
    }
  }
}
