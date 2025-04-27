import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() address: string = '';
  map: google.maps.Map | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadGoogleMaps();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private loadGoogleMaps(): void {
    if (typeof google === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDODHGmGhg5lsUhq-5tM5nZ_xckcyFDw9Q&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => this.initMap();
      script.onerror = () => {
        this.error = 'Failed to load Google Maps API';
        this.loading = false;
      };
      document.head.appendChild(script);
    } else {
      this.initMap();
    }
  }

  private initMap(): void {
    try {
      this.map = new google.maps.Map(
        document.getElementById('map-container') as HTMLElement,
        {
          center: { lat: 0, lng: 0 },
          zoom: 8
        }
      );
      this.geocodeAddress();
    } catch (err) {
      this.error = 'Map initialization failed';
      console.error('Map error:', err);
    } finally {
      this.loading = false;
    }
  }

  private geocodeAddress(): void {
    if (!this.address || !this.map) return;

    new google.maps.Geocoder().geocode(
      { address: this.address },
      (results, status) => {
        if (status === 'OK' && results?.[0]) {
          this.map?.setCenter(results[0].geometry.location);
          new google.maps.Marker({
            map: this.map,
            position: results[0].geometry.location
          });
        } else {
          this.error = 'Address not found';
          console.error('Geocode error:', status);
        }
      }
    );
  }

  private cleanup(): void {
    // Clean up map instance
    if (this.map) {
      google.maps.event.clearInstanceListeners(this.map);
    }
  }
}
