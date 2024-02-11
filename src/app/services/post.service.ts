import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type PostModel = {
  id: number
  content: string
  title: string
  private: boolean
  created_at: string
}


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000/api/v1/posts'
  constructor(private http: HttpClient) { }

}
