import { ChangeDetectionStrategy, Component, Input,  } from '@angular/core';
import { HousingLocation } from '../housinglocation';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './housing-location.component.html',
  styleUrl: './housing-location.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
  
})
export class HousingLocationComponent {

  @Input() housingLocation!: HousingLocation;

}
