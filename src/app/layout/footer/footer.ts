import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  @Input() year: number = new Date().getFullYear(); // optional dynamic year
  @Input() company: string = 'Pulse Dashboard'; // optional company name

}
