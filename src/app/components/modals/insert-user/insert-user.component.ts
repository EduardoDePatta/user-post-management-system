import { Component } from '@angular/core';
import { UserCreationModel, UserService } from '../../../services/user.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-insert-user',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './insert-user.component.html',
  styleUrl: './insert-user.component.scss'
})

export class InsertUserComponent {
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<InsertUserComponent>,
    private snackBar: MatSnackBar
  ){}

  userForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]),
    first_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]),
    last_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  isLoading: boolean = false
  hide: boolean = true

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true

      const userData: UserCreationModel = {
        login: this.userForm.value.login!,
        first_name: this.userForm.value.first_name!,
        last_name: this.userForm.value.last_name!,
        email: this.userForm.value.email!,
        password: this.userForm.value.password!,
      }

      this.userService.insertUser(userData).subscribe({
        next: (response) => {
          this.openSnackBar(response.message ?? 'Successfully created user.')
          this.isLoading = false
          this.dialogRef.close(true)        
        },
        error: (error) => {
          this.openSnackBar(error.error.message)
          this.isLoading = false
        }
      })
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
