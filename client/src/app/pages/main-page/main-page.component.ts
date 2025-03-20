import { Component, signal, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { CardComponent } from '../../components/card/card.component';
import { ResultsGridComponent } from '../../components/results-grid/results-grid.component';
import { DataFetchingService } from '../../services/data-fetching.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    RouterOutlet,
    NgClass,
    CardComponent,
    ButtonComponent,
    SpinnerComponent,
    ResultsGridComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  readonly dataFetchingService = inject(DataFetchingService);
  readonly messageService = inject(MessageService);
  readonly zapytanieForm = new FormGroup({
    query: new FormControl(this.dataFetchingService.query()),
  });

  submitQuery() {
    const userInput = this.zapytanieForm.value.query || '';
    this.dataFetchingService.fetchAiAnswers(userInput);
  }
}
