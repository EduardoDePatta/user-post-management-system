import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-remove-user',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './remove-user.component.html',
  styleUrl: './remove-user.component.scss'
})

export class RemoveUserComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
