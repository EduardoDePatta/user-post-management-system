import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export type UserModel = {
  id: number
  login: string
  first_name: string
  last_name: string
  email: string
  password: string
}

interface IFetchData {
  message: string
  data?:{
    dataSource: UserModel[]
    total: number
  } 
}

interface IRemoveData {
  message?: string
  data?: UserModel
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/v1/user'
  private updateUserSubject = new Subject<void>()
  private searchSubject = new BehaviorSubject<string>('')

  constructor(private http: HttpClient) { }

  fetchUsers(pageIndex: number = 0, pageSize: number = 10): Observable<IFetchData> {
    return this.http.get<IFetchData>(`${this.apiUrl}?page=${pageIndex + 1}&limit=${pageSize}`);
  }

  updateuser(): void {
    this.updateUserSubject.next()
  }

  onUpdateUser(): Observable<void> {
    return this.updateUserSubject.asObservable()
  }

  setSearchTerm(searchTerm: string) {
    this.searchSubject.next(searchTerm)
  }

  getSearchTerm(): Observable<string> {
    return this.searchSubject.asObservable()
  }

  onSearch(searchTerm: string, pageIndex: number = 0, pageSize: number = 10): Observable<IFetchData> {
    const url = `${this.apiUrl}/search?term=${encodeURIComponent(searchTerm)}&page=${pageIndex + 1}&limit=${pageSize}`
    return this.http.get<IFetchData>(url)
  }

  deleteUser(userId: number): Observable<IRemoveData> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
}
