import { Component, Inject } from '@angular/core';
import { PostTableComponent } from '../../core/post-table/post-table.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModel } from '../../../services/user.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [PostTableComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public user: UserModel){}  
}
