import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient) { }
  
  async login(username: string, password: string): Promise<any> {
    try {
      const response = await axios.post(this.apiUrl, { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  saveUser(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }
}