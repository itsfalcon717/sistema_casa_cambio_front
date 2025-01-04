import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) {}
  roles(): Observable<any[]> {
    return this.http.get<any>(environment.rol.list).pipe();
    }
  listRolId(id: any): Observable<any[]> {
  return this.http.get<any>(environment.rol.listId+id).pipe();
  }
  updatePermiso(body: any): Observable<any> {
    return this.http.put<any>(environment.rol.update, body)
  }
}
