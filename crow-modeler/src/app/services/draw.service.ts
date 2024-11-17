import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Response-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})



export class DrawService {

  constructor(private http: HttpClient) { }

  saveGraphic(obj:any){
    return this.http.post("URL_LOGIN",obj,httpOptions)
  }

}
