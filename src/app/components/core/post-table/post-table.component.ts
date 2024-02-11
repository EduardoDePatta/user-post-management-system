import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { EditUserComponent } from '../../modals/edit-user/edit-user.component';
import { RemoveUserComponent } from '../../modals/remove-user/remove-user.component';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostModel } from '../../../services/post.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-post-table',
  standalone: true,
  imports: [MatPaginatorModule,
    MatTableModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinner,
    CommonModule,
    MatDialogModule,
    EditUserComponent,
    RemoveUserComponent,
    AutocompleteComponent,
    MatTooltipModule],
  templateUrl: './post-table.component.html',
  styleUrl: './post-table.component.scss'
})
export class PostTableComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userService: UserService
  ){
  }
  data: PostModel[] = []
  isLoading: boolean = false
  total = 0
  pageEvent?: PageEvent
  displayedColumns: string[] = ['id', 'title', 'content', 'created_at', 'actions']
  @Input() userId!: number

  ngOnInit(): void {
    this.fetchData()
    // this.userService.onUpdateUser().subscribe(() => {
    //   this.fetchData()
    // })
    // this.userService.getSearchTerm().subscribe(term => {
    //   if (term) {
    //     this.handleSearch(term)
    //   } else {
    //     this.fetchData()
    //   }
    // })

    // this.fetchData()
  }

  fetchData() {
    this.isLoading = true;

    const pageIndex = this.pageEvent?.pageIndex ?? 0
    const pageSize = this.pageEvent?.pageSize ?? 10
    console.log('IDDDDDDDDD', this.userId)
    this.userService.fetchPostsFromUser(this.userId, pageIndex, pageSize).subscribe({
      next: (response) => {
        console.log("🚀 ~ PostTableComponent ~ this.userService.fetchPostsFromUser ~ response:", response)
        this.data = response.data?.dataSource ?? []
        this.total = response.data?.total ?? 0
        this.isLoading = false;
      },
      error: (error) => {
        this.openSnackBar(error.error.message)
        this.isLoading = false;
      }
    })
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
