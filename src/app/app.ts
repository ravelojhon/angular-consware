import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalLoading } from './shared/global-loading/global-loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalLoading],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular_consware');
}
