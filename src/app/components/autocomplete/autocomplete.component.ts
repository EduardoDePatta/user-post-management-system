import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss'
})
export class AutocompleteComponent {
  @Output() searchEvent = new EventEmitter<string>()

  searchTerm: string = ''

  onSearchChange(): void {
    this.searchEvent.emit(this.searchTerm)
  }
}
