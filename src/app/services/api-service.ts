import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private API_URL = 'http://localhost:9090/api';

  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async get<T>(endpoint: string, params?: any): Promise<T> {
    const res = await axios.get<T>(`${this.API_URL}${endpoint}`, {
      headers: this.getAuthHeader(),
      params
    });
    return res.data;
  }

  async post<T>(endpoint: string, payload: any, config?: AxiosRequestConfig): Promise<T> {
    const res = await axios.post<T>(`${this.API_URL}${endpoint}`, payload, {
      headers: this.getAuthHeader(),
      ...config
    });
    return res.data;
  }

  async put<T>(endpoint: string, payload: any, config?: AxiosRequestConfig): Promise<T> {
    const res = await axios.put<T>(`${this.API_URL}${endpoint}`, payload, {
      headers: this.getAuthHeader(),
      ...config
    });
    return res.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await axios.delete<T>(`${this.API_URL}${endpoint}`, {
      headers: this.getAuthHeader(),
      ...config
    });
    return res.data;
  }
}
