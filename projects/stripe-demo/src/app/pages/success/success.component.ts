import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuccessComponent {
  public readonly orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
} 