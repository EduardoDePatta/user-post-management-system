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

// TODO: esse @component com certeza não está certo...otimizar esses imports...existe lazy, falando nisso?
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
    AutocompleteComponent
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})

// TODO: ver angular material > loading state(?)
export class TableComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userService: UserService,
    
  ){}
  data: UserModel[] = []
  isLoading: boolean = false

  total = 0
  pageEvent?: PageEvent

  displayedColumns: string[] = ['id', 'login', 'first_name', 'last_name', 'email', 'password', 'actions'];


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
        this.openSnackBar(error.message)
        this.isLoading = false;
      }
    })
  }

  handlePage(event: PageEvent) {
    this.pageEvent = event
    this.fetchData()
  }

  handleEdit(user: UserModel){
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
          this.openSnackBar(error.message)
          this.isLoading = false
        }
      })
    } else {

      this.fetchData()
    }
  }

  handleRemove(userId: number) {
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
            this.openSnackBar(error.message)
            this.isLoading = false
          }
        })
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
