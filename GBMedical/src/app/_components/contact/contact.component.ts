import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-connection',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})


export class ContactComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  private map!: L.Map;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.map = L.map(this.mapContainer.nativeElement, {
        center: [46.0723, 18.2280], // MyClinic Pécs koordináták
        zoom: 15,
        scrollWheelZoom: false,
        dragging: false,
        zoomControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      L.marker([46.0723, 18.2280]).addTo(this.map)
        .bindPopup('MyClinic Pécs')
        .openPopup();

      this.map.invalidateSize(); // 🔹 Fontos! Frissíti a térképet, ha az nem megfelelően renderelődött
    }, 300); // Késleltetés, hogy a DOM teljesen betöltődjön
  }
}
