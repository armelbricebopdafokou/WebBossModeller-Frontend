import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { URL_LOGIN, URL_REGISTER, URL_SAVE_GRAPHIC } from '../interfaces/constants';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Response-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(obj:any):Observable<User>{
    return this.http.post<User>(URL_LOGIN,obj,httpOptions)
  }

  register(obj:any):Observable<User>{
    return this.http.post<User>(URL_REGISTER,obj,httpOptions)
  }

  saveGraphics(obj:any):Observable<any>{
    return this.http.post<User>(URL_SAVE_GRAPHIC, obj,httpOptions)
  }
}
