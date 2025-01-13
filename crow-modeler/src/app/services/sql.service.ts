import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_LOGIN, URL_MSSQL_CODE, URL_MYSQL_CODE, URL_POSTGRES_CODE, URL_REGISTER, URL_SAVE_GRAPHIC } from '../interfaces/constants';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'text' as const
};
const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
@Injectable({
  providedIn: 'root'
})
export class SqlService {

  
  constructor(private http: HttpClient) { }


  getSQLCodeMssql(obj:any){
    console.log(obj)
    return this.http.post(URL_MSSQL_CODE,obj,httpOptions)
  }

  getSQLCodeMysql(obj:any){
    console.log(obj)
    return this.http.post(URL_MYSQL_CODE,obj,httpOptions)
  }

  getSQLCodePostgres(obj:any){
    console.log(obj)
    return this.http.post(URL_POSTGRES_CODE,obj,httpOptions)
  }



}
