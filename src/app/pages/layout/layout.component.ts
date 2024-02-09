import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { AutocompleteComponent } from '../../components/autocomplete/autocomplete.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatIconModule, MatToolbarModule, AutocompleteComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})

export class LayoutComponent {
  constructor(private userService: UserService){
  }

  handleSearch(searchTerm: string): void {
    this.userService.setSearchTerm(searchTerm)
  }
}
