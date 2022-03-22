import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import * as dtoProduct from '../dto/product';
import * as dtoUser from '../dto/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  url = environment.URL;
  headers = new HttpHeaders({
    'Authorization': this.authService.getToken(),
  });

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  errorHandler(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  signin(loginReq: dtoProduct.LoginReq) {
    return this.http.post<any>(`${this.url}/user/login`, loginReq)
    .pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }

  getProducts() {
    return this.http.get<dtoProduct.ListProductsRes>(`${this.url}/product/list-products`)
    .pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }

  addProduct(product: dtoProduct.Product) {
    return this.http.post<any>(`${this.url}/product/create-product`, product, {
      headers: this.headers,
    }).pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }

  editProduct(product: dtoProduct.Product) {
    return this.http.patch<any>(`${this.url}/product/edit-product`, product, {
      headers: this.headers,
    }).pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }

  deleteProduct(id: number) {
    return this.http.delete<any>(`${this.url}/product/delete-product?id=${id}`, {
      headers: this.headers,
    }).pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }

  getUsers(){
    return this.http.get<dtoUser.ListUsersRes>(`${this.url}/admin/list-customers`)
    .pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }

  addUsers(user: dtoUser.User){
    return this.http.post<any>(`${this.url}/admin/create-customer`, user, {
      headers: this.headers,
    }).pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }

  editUser(user: dtoUser.User){
    return this.http.patch<any>(`${this.url}/admin/edit-customer`, user, {
      headers: this.headers,
    }).pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }

  deleteUser(id: number) {
    return this.http.delete<any>(`${this.url}/admin/delete-customer?id=${id}`, {
      headers: this.headers,
    }).pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }
}
