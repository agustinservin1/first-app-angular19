import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { HousingLocation } from '../components/housinglocation';

interface SeoConfig {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {

  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);
  
  private readonly baseConfig = {
    siteName: 'Angular-Housings',
    baseUrl: 'https://localhost:4200'
  };

  configureSeo(config: SeoConfig): void {

    if (!this.validateConfig(config)) {
      console.warn('SEO configuration missing required fields');
      return;
    }

    try {
      this.cleanExistingTags();
      this.setBasicTags(config);
      this.setOpenGraphTags(config);
      this.setTwitterTags(config);
    } catch (error) {
      console.error('Error configuring SEO:', error);
    }
  }

  private validateConfig(config: SeoConfig): boolean {
    return Boolean(config.title && config.description);
  }

  private cleanExistingTags(): void {

    const selectors = [
      'meta[name="description"]',
      'meta[name="keywords"]',
      'meta[property^="og:"]',
      'meta[name^="twitter:"]'
    ].join(',');

    const existingTags = this.document.querySelectorAll(selectors);
    existingTags.forEach(tag => tag.remove());
  }

  private setBasicTags(config: SeoConfig): void {

    const fullTitle = `${config.title} | ${this.baseConfig.siteName}`;
    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords', content: config.keywords.join(', ') });
  }

  private setOpenGraphTags(config: SeoConfig): void {
    const url = config.url || this.getCanonicalUrl();
    
    const ogTags = [
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: this.baseConfig.siteName }
    ];

    if (config.image) {
      ogTags.push({ property: 'og:image', content: config.image });
    }

    ogTags.forEach(tag => this.meta.updateTag(tag));
  }

  private setTwitterTags(config: SeoConfig): void {
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: config.title },
      { name: 'twitter:description', content: config.description }
    ];

    if (config.image) {
      twitterTags.push({ name: 'twitter:image', content: config.image });
    }

    twitterTags.forEach(tag => this.meta.updateTag(tag));
  }

  private getCanonicalUrl(): string {

    if (isPlatformServer(this.platformId)) {
      return `${this.baseConfig.baseUrl}${this.document.location.pathname}`;
    }
    return this.document.URL;
  }

  setCanonicalUrl(url: string): void {
    const canonicalElement = this.document.querySelector('link[rel="canonical"]');
    
    if (canonicalElement) {
      canonicalElement.setAttribute('href', url);
    } else {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.document.head.appendChild(link);
    }
  }
  configureDynamicSeoFromHousing(housing: HousingLocation): void {
    const keywords = [
      'housing',
      housing.city,
      housing.state,
      housing.wifi ? 'wifi included' : '',
      housing.laundry ? 'laundry service' : '',
      `${housing.availableUnits} units available`
    ].filter(Boolean);

    this.configureSeo({
      title: housing.name,
      description:`Discover this property in ${housing.city}, ${housing.state}. ${housing.availableUnits} units available. ${housing.wifi ? 'WiFi included.' : ''} ${housing.laundry ? 'Laundry service available.' : ''}`,
      keywords,
      image: housing.photo,
      url: `${this.baseConfig.baseUrl}/details/${housing.id}`
    });
  }
}
 