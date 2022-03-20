import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import * as dto from '../dto/dto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  url = environment.URL;
  headers = new HttpHeaders();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
    this.headers.append('Authorization', this.authService.getToken());
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  signin(loginReq: dto.LoginReq) {
    return this.http.post<any>(`${this.url}/user/login`, loginReq)
    .pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }

  getProducts() {
    return this.http.get<dto.ListProductsRes>(`${this.url}/product/list-products`)
    .pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }

  addProduct(product: dto.Product) {
    return this.http.post<any>(`${this.url}/product/create-product`, product, {
      headers: this.headers,
    }).pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }

  editProduct(product: dto.Product) {
    return this.http.patch<any>(`${this.url}/product/edit-product`, product, {
      headers: this.headers,
    }).pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }

  deleteProduct(id: number) {
    return this.http.delete<any>(`${this.url}/product/delete-product?id=${id}`, {
      headers: this.headers
    }).pipe(
      retry(1),
      catchError(this.errorHandler),
    )
  }
}
