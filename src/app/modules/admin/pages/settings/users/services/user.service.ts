import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

 constructor(private http: HttpClient) {}

  listUsers(body: any): Observable<any> {
    return this.http.post<any>(environment.users.list, body)
  }

  crearUsers(body: any): Observable<any> {
    return this.http.post<any>(environment.users.create, body)
  }
  updateUsers(body: any): Observable<any> {
    return this.http.post<any>(environment.users.update, body)
  }

  deleteUsers(body: any): Observable<any> {
    return this.http.post<any>(environment.users.delete, body)
  }
}
