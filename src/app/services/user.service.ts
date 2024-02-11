import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PostModel } from './post.service';
import { AuthService } from './auth.service';

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

interface IInsertData {
  message?: string
  data?: UserModel
}

interface IFetchPosts {
  message: string
  data?:{
    dataSource: PostModel[]
    total: number
  }
}

export interface UserCreationModel {
  login: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://localhost:3000/api/v1/users'
  private updateUserSubject = new Subject<void>()
  private searchSubject = new BehaviorSubject<string>('')  

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  fetchUsers(pageIndex: number = 0, pageSize: number = 10): Observable<IFetchData> {
    return this.http.get<IFetchData>(`${this.apiUrl}?page=${pageIndex + 1}&limit=${pageSize}`)
  }

  fetchPostsFromUser(isUsuario: number, pageIndex: number = 0, pageSize: number = 10): Observable<IFetchPosts> {
    return this.http.get<IFetchPosts>(`${this.apiUrl}/${isUsuario}/posts?page=${pageIndex + 1}&limit=${pageSize}`)
  }

  updateUser(): void {
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

  insertUser(userData: UserCreationModel): Observable<IInsertData> {
    return this.http.post<IInsertData>(this.apiUrl, userData);
  }
}
