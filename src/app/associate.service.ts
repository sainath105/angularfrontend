import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Associate } from './associate.model';

@Injectable({
  providedIn: 'root'
})
export class AssociateService {
  private apiUrl = 'http://localhost:8080/api/associates';

  constructor(private http: HttpClient) { }

  getAssociates(): Observable<Associate[]> {
    return this.http.get<Associate[]>(this.apiUrl);
  }

  getProgrammingLanguages(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/programming-languages`);
  }

  getQualificationLevels(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/qualification-levels`);
  }

  createAssociate(associate: Associate): Observable<Associate> {
    return this.http.post<Associate>(this.apiUrl, associate);
  }

  updateAssociate(id: number, associate: Associate): Observable<Associate> {
    return this.http.put<Associate>(`${this.apiUrl}/${id}`, associate);
  }

  deleteAssociate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  downloadKanbanHtml() {
    return this.http.get(`${this.apiUrl}/download-kanban`, { responseType: 'text' });
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getSkillDistribution(): Observable<any> {
    return this.http.get(`${this.apiUrl}/skill-distribution`);
  }

  
  addAssociate(associate: Omit<Associate, 'id'>): Observable<Associate> {
    return this.http.post<Associate>(`${this.apiUrl}`, associate);
}

  
}
