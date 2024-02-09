import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { AutocompleteComponent } from '../../components/autocomplete/autocomplete.component';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { InsertUserComponent } from '../../components/modals/insert-user/insert-user.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatIconModule, MatToolbarModule, AutocompleteComponent, MatButtonModule, RouterModule, MatTooltipModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})

export class LayoutComponent {
  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ){
  }

  handleSearch(searchTerm: string): void {
    this.userService.setSearchTerm(searchTerm)
  }

  openAddUserModal(): void {
    const dialogRef = this.dialog.open(InsertUserComponent, {
      width: '500px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.userService.fetchUsers()
      }
    })
  }
}
