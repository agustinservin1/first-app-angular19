import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../housinglocation';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
  
})
export class DetailsComponent {
  private cdr = inject(ChangeDetectorRef);
  route : ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);

  housingLocation : HousingLocation | undefined;
  
  private destroy$ = new Subject<void>();

  formAngular = new FormGroup({
    firstName: new FormControl('', { nonNullable: true }),
    lastName: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true })
  });
  
  ngOnInit() {
    const housingLocationId = Number(this.route.snapshot.params['id']);

    this.housingService.getHousingLocationById(housingLocationId)
      .pipe(
        takeUntil(this.destroy$) 
      )
      .subscribe({
        next: (location) => {
          this.housingLocation = location;
          this.cdr.markForCheck(); 

        },
        error: (error) => {
          console.error('Error cargando la ubicación:', error);
        }
      });
  }

  onSubmit() {
    if (this.formAngular.valid && this.housingLocation) {
      const applicationData = {
        firstName: this.formAngular.value.firstName!,
        lastName: this.formAngular.value.lastName!,
        email: this.formAngular.value.email!,
        locationId: this.housingLocation.id
      };

      this.housingService.submitApplication(applicationData)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (response) => {
            console.log('Aplicación enviada exitosamente', response);
            this.formAngular.reset();
          },
          error: (error) => {
            console.error('Error enviando la aplicación:', error);
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();     
    this.destroy$.complete(); 
  }
}