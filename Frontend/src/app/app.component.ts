import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SigComponent } from '../sig/sig.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SigComponent],
  templateUrl: './app.component.html',
  //styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sig';
}
