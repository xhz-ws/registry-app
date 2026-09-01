import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FormRecord } from '../models/form-record';

@Injectable({
  providedIn: 'root'
})
export class Records {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/forms`;

  getAll(): Observable<FormRecord[]> {
    return this.http.get<FormRecord[]>(this.apiUrl);
  }

  create(record: FormRecord): Observable<FormRecord> {
    return this.http.post<FormRecord>(this.apiUrl, record);
  }

  update(id: string, record: FormRecord): Observable<FormRecord> {
    return this.http.put<FormRecord>(`${this.apiUrl}/${id}`, record);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}