import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserModel, UserService } from '../../../services/user.service';

interface ISaveChanges {
  message: string
  data?: UserModel
}

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})

export class EditUserComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public user: UserModel,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private dialogRef: MatDialogRef<EditUserComponent>
  ) {
    this.editedUser = { ...user }
  }
  
  http = inject(HttpClient)
  editedUser: UserModel
  isLoading: boolean = false

  saveChanges() {
    this.isLoading = true
    this.http.put<ISaveChanges>(`http://localhost:3000/api/v1/user/${this.editedUser.id}`, this.editedUser)
      .subscribe({
        next: (response) => {
          this.openSnackBar(response.message)
          this.userService.fetchUsers().subscribe({
            next: (response) => {
              this.openSnackBar(response.message)
              this.userService.updateuser()
              this.isLoading = false
              this.dialogRef.close()
            }
          })
        },
        error: (error) => {
          this.openSnackBar(error.message)
          this.isLoading = false
        }
      })
  }

  close(){}

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
