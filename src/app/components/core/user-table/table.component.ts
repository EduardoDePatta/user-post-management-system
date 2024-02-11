import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import {MatButtonModule} from '@angular/material/button'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import {MatIconModule} from '@angular/material/icon'
import {MatProgressSpinner} from '@angular/material/progress-spinner'
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { EditUserComponent } from '../../modals/edit-user/edit-user.component';
import { UserModel, UserService } from '../../../services/user.service';
import { RemoveUserComponent } from '../../modals/remove-user/remove-user.component';
import { AutocompleteComponent } from '../../autocomplete/autocomplete.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostsComponent } from '../../modals/posts/posts.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatPaginatorModule,
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
    MatTooltipModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {
  data: UserModel[] = []
  isLoading: boolean = false
  total = 0
  pageEvent?: PageEvent
  displayedColumns: string[] = ['id', 'login', 'first_name', 'last_name', 'email', 'actions'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userService: UserService    
  ){}

  ngOnInit(): void {
    this.fetchData()
    this.userService.onUpdateUser().subscribe(() => {
      this.fetchData()
    })
    this.userService.getSearchTerm().subscribe(term => {
      if (term) {
        this.handleSearch(term)
      } else {
        this.fetchData()
      }
    })

    this.fetchData()
  }

  fetchData() {
    this.isLoading = true;

    const pageIndex = this.pageEvent?.pageIndex ?? 0
    const pageSize = this.pageEvent?.pageSize ?? 10
    this.userService.fetchUsers(pageIndex, pageSize).subscribe({
      next: (response) => {
        this.data = response.data?.dataSource ?? []
        this.total = response.data?.total ?? 0
        this.isLoading = false;
      },
      error: (error) => {
        this.openSnackBar(error.error?.message ?? '')
        this.isLoading = false;
      }
    })
  }

  handlePage(event: PageEvent) {
    this.pageEvent = event
    this.fetchData()
  }

  handleEdit(user: UserModel, event: MouseEvent){
    event.stopPropagation()
    this.dialog.open(EditUserComponent, {
      width: '500px',
      data: user
    }) 
  }

  handleSearch(searchTerm: string): void {
    console.log("🚀 ~ TableComponent ~ handleSearch ~ searchTerm:", searchTerm)
    if (searchTerm) {
      this.isLoading = true
      const pageIndex = this.pageEvent?.pageIndex ?? 0
      const pageSize = this.pageEvent?.pageSize ?? 10
  
      this.userService.onSearch(searchTerm, pageIndex, pageSize).subscribe({
        next: (response) => {
          this.data = response.data?.dataSource ?? []
          this.total = response.data?.total ?? 0
          this.isLoading = false
        },
        error: (error) => {
          this.openSnackBar(error.error.message)
          this.isLoading = false
        }
      })
    } else {

      this.fetchData()
    }
  }

  handleRemove(userId: number, event: MouseEvent) {
    event.stopPropagation()
    const dialogRef = this.dialog.open(RemoveUserComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this user?'}
    })

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed === 'true') {
        this.isLoading = true
        this.userService.deleteUser(userId).subscribe({
          next: (response) => {
            this.openSnackBar(response.message as string)
            this.fetchData()
            this.isLoading = false
          },
          error: (error) => {
            this.openSnackBar(error.error.message)
            this.isLoading = false
          }
        })
      }
    })
  }

  handleRowClick(user: UserModel) {
    this.dialog.open(PostsComponent, {
      width: '700px',
      data: user
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
