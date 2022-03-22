import { Component, OnInit } from '@angular/core';
import * as dto from '../dto/product';
import { HttpService } from '../services/http.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loginReq: dto.LoginReq = {
    username: '',
    password: '',
  }

  constructor(
    private http: HttpService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.http.signin(this.loginReq).subscribe({
      next: data => {
        if(data.status === 'SUCCESS') {
          Swal.fire({
            title: 'Success',
            text: `Sign in successfully`,
            icon: 'success',
            heightAuto: false,
          });
          localStorage.setItem('access_token', `Bearer ${data.details}`);
          this.router.navigate(['/product']);
        }else{
          Swal.fire({
            title: 'Error',
            text: 'error in login',
            icon: 'error',
            heightAuto: false,
          });
        }
      }, error: err => {
        Swal.fire({
          title: 'Error',
          text: `err is ${err}`,
          icon: 'error',
          heightAuto: false,
        });
      }
    });
  }
}
