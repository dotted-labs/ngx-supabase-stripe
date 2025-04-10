import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payouts',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payouts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayoutsComponent {} 