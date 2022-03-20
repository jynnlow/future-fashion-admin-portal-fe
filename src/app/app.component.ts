import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentPath = '';
  title = 'future-fashion-admin-portal-fe';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentPath = e.urlAfterRedirects;
      }
    });
  }

  async signout() {
    let confirmationRes = await Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to sign out?',
      showDenyButton: true,
      heightAuto: false,
    })

    if(confirmationRes.isConfirmed) {
      this.authService.signout();
      this.router.navigate(['/signin']);
    }
  }
 
}
