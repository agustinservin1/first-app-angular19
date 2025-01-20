import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HousingService } from '../housing.service';
import { Subject, takeUntil } from 'rxjs';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HousingLocation } from '../housinglocation';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [HousingLocationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  housingService: HousingService = inject(HousingService);
  platformId = inject(PLATFORM_ID);
  isBrowser: boolean;

  private destroy$ = new Subject<void>();
  housingLocationList: HousingLocation[] = [];
  filteredLocationList: HousingLocation[] = [];

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadLocations();
  }

  private loadLocations() {
    this.housingService.getAllHousingLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (locations) => {
          this.housingLocationList = locations;
          this.filteredLocationList = locations;
        },
        error: (error) => {
          console.error('Error loading locations:', error);
        },
      });
  }

  filterResults(text: string) {
    if (!this.isBrowser) {
      return;
    }

    if (!text) {
      this.filteredLocationList = [...this.housingLocationList];
      return;
    }

    this.filteredLocationList = this.housingLocationList.filter((location) =>
      location.city.toLowerCase().includes(text.toLowerCase())
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
