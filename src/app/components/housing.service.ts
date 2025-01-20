import { inject, Injectable } from '@angular/core';
import { HousingLocation } from './housinglocation';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  getHousingLocationById(id: number): Observable<HousingLocation> {
    return this.http.get<HousingLocation>(`${this.baseUrl}/locations/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching housing location by ID: ${id}`, error);
        return throwError(
          () => new Error(`Failed to fetch housing location with ID: ${id}`)
        );
      })
    );
  }  
  getAllHousingLocations(): Observable<HousingLocation[]> {
    return this.http.get<HousingLocation[]>(`${this.baseUrl}/locations`).pipe(
      catchError((error) => {
        console.error('Error fetching all housing locations', error);
        return throwError(() => new Error('Failed to fetch housing locations'));
      })
    );
  }

  submitApplication(application: {
    firstName: string;
    lastName: string;
    email: string;
    locationId: number;
  }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/applications`, application).pipe(
      catchError((error) => {
        console.error('Error submitting application', error);
        return throwError(() => new Error('Failed to submit application'));
      })
    );
  }
}