import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import {MatInputModule} from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'
import { UserModel, UserService } from '../../../services/user.service'

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
    private dialogRef: MatDialogRef<EditUserComponent>,
    private http: HttpClient
  ) {
    this.editedUser = { ...user }
  }
  
  editedUser: UserModel
  isLoading: boolean = false

  saveChanges() {
    const formErrors = this.validateForm()

    if (formErrors.length === 0) {
      this.isLoading = true
      this.http.put<ISaveChanges>(`http://localhost:3000/api/v1/user/${this.editedUser.id}`, this.editedUser)
        .subscribe({
          next: (response) => {
            this.openSnackBar(response.message)
            this.userService.fetchUsers().subscribe({
              next: (response) => {
                this.openSnackBar(response.message)
                this.userService.updateUser()
                this.isLoading = false
                this.dialogRef.close()
              }
            })
          },
          error: (error) => {
            this.openSnackBar(error.error.message)
            this.isLoading = false
          }
        })
    } else {
      this.openSnackBar(formErrors.join('\n'))
    }
  }

  validateForm(): string[] {
    const errors: string[] = []
    const { login, first_name, last_name, email } = this.editedUser
  
    if (!login || login.length < 3 || login.length > 14) {
      errors.push('Login must be between 3 and 14 characters')
    }
    if (!first_name || first_name.length < 3 || first_name.length > 14) {
      errors.push('First name must be between 3 and 14 characters')
    }
    if (!last_name || last_name.length < 3 || last_name.length > 14) {
      errors.push('Last name must be between 3 and 14 characters')
    }
    // regex pra verificar se email valido
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email address')
    }
  
    return errors
  }
  

  close(): void {
    this.dialogRef.close()
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    })
  }
}
