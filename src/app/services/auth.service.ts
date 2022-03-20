import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  isLoggedIn(): boolean {
    if(localStorage.getItem('access_token')) {
      return true;
    }
    return false;
  }

  signout() {
    localStorage.removeItem('access_token');
  }

  getToken(): string {
    let token = '';
    if(localStorage.getItem('access_token')) {
      token = localStorage.getItem('access_token')!;
    }
    return token;
  }
}
