import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HousingService } from '../housing.service';
import { Subject, takeUntil } from 'rxjs';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HousingLocation } from '../housinglocation';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [HousingLocationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {

  housingService: HousingService = inject(HousingService);
  
  housingLocationList: HousingLocation[] = [];
  filteredLocationList: HousingLocation[] = [];
  
  private readonly seoService = inject(SeoService);
  
  platformId = inject(PLATFORM_ID);
  isBrowser: boolean;
  
  private destroy$ = new Subject<void>();
  

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadLocations();
    this.configureServerSeo();
  }

  private loadLocations() {
    this.housingService
      .getAllHousingLocations()
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
  private configureServerSeo(): void {
    if (isPlatformServer(this.platformId)) {
      this.seoService.configureSeo({
        title: 'Find Your Ideal Home | AngularRealEstate',
        description: 'Explore our selection of the best properties for sale and rent.',
        keywords: ['properties', 'houses', 'apartments', 'sale', 'rent'],
        image: 'https://examplephoto.com/og-image.jpg',
        url: 'https://localhost:4200',
      });

      this.seoService.setCanonicalUrl('https://localhost:4200');
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
