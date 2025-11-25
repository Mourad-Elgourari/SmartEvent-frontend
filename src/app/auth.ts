import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class Auth {
  private API_URL = 'http://localhost:9090/api/auth';
  private readonly USER_KEY = 'user';

  // 🔹 Register new user
  async register(username: string, email: string, password: string) {
    const res = await axios.post(`${this.API_URL}/register`, { username, email, password });

    // Expected response: { token, user }
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    this.setUser(user);
  }

  // 🔹 Login existing user
  async login(email: string, password: string) {
    const res = await axios.post(`${this.API_URL}/login`, { email, password });

    // Expected response: { token, user }
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    this.setUser(user);
  }

  // 🔹 Logout user
  async logout() {
    try {
      await axios.get(`${this.API_URL}/logout`);
    } catch (err) {
      console.warn('Backend logout failed, continuing...');
    }
    localStorage.removeItem('token');
    localStorage.removeItem(this.USER_KEY);
  }

  // 🔹 Get JWT token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🔹 Check if logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 🔹 Save user
  setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // 🔹 Get user
  getUser(): any | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // 🔹 Fetch user from backend (when refreshing the page)
  async fetchUser(): Promise<any> {
    const token = this.getToken();
    if (!token) return null;

    const res = await axios.get(`${this.API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    this.setUser(res.data);
    return res.data;
  }
}
