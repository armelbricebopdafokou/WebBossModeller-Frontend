import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
export class SqlService {

  constructor(private http: HttpClient) { }


  getSQLCodeMssql(obj:any){
    return this.http.post<any>('http://localhost:3000/sql',obj,httpOptions)
  }

  getSQLCodeMysql(obj:any){
    return this.http.post<any>('http://localhost:3000/sql',obj,httpOptions)
  }

  getSQLCodePostgres(obj:any){
    return this.http.post<any>('http://localhost:3000/sql',obj,httpOptions)
  }



}
