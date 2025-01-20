import { bootstrapApplication, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';  
import { provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';


bootstrapApplication(AppComponent,{ 
  providers:[provideRouter(routes),
     provideClientHydration(withEventReplay()),
     provideZoneChangeDetection(),//
     provideHttpClient()],
 }).catch((err) => console.error(err));
