import {Component, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {PositionService} from '../_services/position.service';
import {Subscription} from 'rxjs';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletDrawModule} from '@asymmetrik/ngx-leaflet-draw';
import {Position} from '../_models/Position';
import {ArchiveService} from "../_services/archive.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [LeafletModule, LeafletDrawModule]
})
export class MapComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  showControlLayer = true;
  position = {lat : 45.05, lng : 7.6666667};
  disableFinishButton = true;
  disableAddButton = false;
  private selected = false;
  private selectedMarkers = [];
  private selectedArchives = [];
  purchaseArea = L.layerGroup();

  /****** MAP VARS ******/

  map: L.Map;
  archiveLayers ={} ;
  archiveColors ={} ;
  topRight: Position = new Position();
  bottomLeft: Position = new Position();
  drawnItems = L.featureGroup();
  mapOptions: any = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 12,
    center: L.latLng([45.05, 7.6666667])
  };
  drawOptions: any = {
    position: 'topleft',
    draw: {
      circle: false,
      rectangle: false,
      circlemarker: false,
      polyline: false,
      marker: false
    },
    edit: {
      featureGroup: this.drawnItems,
      edit: false,
      remove: false
    }};
  drawOptionsDisabled: any = {
    position: 'topleft',
    draw: {
      circle: false,
      rectangle: false,
      circlemarker: false,
      polyline: false,
      marker: false,
      polygon: false
    },
    edit: {
      featureGroup: this.drawnItems,
      edit: false,
    }};
  /************************/
  constructor(private positionService: PositionService, private archiveService: ArchiveService) {}
  ngOnInit(): void {
    this.subscription = this.positionService.currentSubject.subscribe(val => this.addMarkers(val));
  }
    onMapReady(map: L.Map): void {
    this.map = map;
    this.initMap();
  }
  private initMap(): void {
    this.map.addLayer(this.drawnItems);
  //  this.map.addControl(this.drawControl);
  //  this.positionService.addMarkersToMap(this.map); // retrieve initial positions
    const corners = this.getMapBounds();
    this.positionService.getMarkers(corners[0], corners[1]);
    this.map.on( L.Draw.Event.CREATED, e => {
      if (e.layer instanceof L.Polygon) {
        this.getArchivesInPolygon(e.layer);
       // e.layer.addTo(this.map);
      }
      console.log(e.layer);
      this.showControlLayer = false;
      this.drawOptionsDisabled.edit.featureGroup.addLayer(e.layer); // add remove button
      this.disableAddButton = true;
    });
    this.map.on(L.Draw.Event.DELETED, ( e => {
      this.selectedMarkers = [];
   //   this.drawControl.setDrawingOptions({ polygon: {}}); // enable drawings again
      this.disableAddButton = true;
      this.showControlLayer = true;
      this.positionService.addSelectedMarker(null);
      this.archiveService.addSelectedArchives(null);

      // this.drawControl.addTo(this.map);
    }));
    this.map.on('moveend', e =>{
      console.log('Event'+ e);
      const corners = this.getMapBounds();
      this.positionService.getMarkers(corners[0], corners[1]);
    });
   /* this.map.on(L.Draw.Event.DELETESTOP, (e => {
        alert(e.layer);
        this.selectedMarkers = [];
      // do something when polygon is deleted
    })); */
  }

  /* add markers received by service */
  addMarkers( positions: any): void{
    this.deletePositions();
    positions.forEach(el => {
      const marker = L.circleMarker([el.latitude, el.longitude]);
      marker.bindPopup(this.popupBody(el));
                             if( !this.archiveLayers[el.archiveId] ){
                               this.archiveLayers[el.archiveId] = new L.LayerGroup();
                               this.archiveColors[el.userId] = this.randomColor();
                              // L.CircleMarker.mergeOptions({color: '#134111'});
                               marker.setStyle({fillColor: this.archiveColors[el.userId]});
                               marker.setStyle({color: this.archiveColors[el.userId]});
                               console.log('Changing color!');
                               marker.addTo(this.archiveLayers[el.archiveId]);
                             } else{
                            // marker.addTo(this.map)
                               marker.setStyle({color: this.archiveColors[el.userId]});
                               marker.setStyle({fillColor: this.archiveColors[el.userId]});
                               marker.addTo(this.archiveLayers[el.archiveId]);}
    });
    for( const list in this.archiveLayers) {
      console.log(list);
      console.log(this.archiveLayers[list]);
      this.archiveLayers[list].addTo(this.map);
    }
  }
  popupBody(position: any): string {
    return `` +
      `<div>Latitude: ${ position.latitude }</div>` +
      `<div>Longitude: ${ position.longitude }</div> `+
      `<div>Owner: ${ position.userId }</div> `;
  }
  randomColor(){
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  /* Get positions inside selected area */
  getArchivesInPolygon(l): void{
    const poly = l.getLatLngs();
    this.archiveService.addSelectedArchives(null);
    Object.keys(this.archiveLayers).forEach((key) => {
      console.log(key);
      this.archiveLayers[key].eachLayer(layer => {
        console.log('layer - ' + layer);
      if (layer instanceof L.CircleMarker && layer.getPopup() != null && this.isMarkerInsidePolygon(layer, poly[0])) {
        this.selectedMarkers.push(layer.getLatLng());
        if(! this.selectedArchives.includes(key)) {
          this.selectedArchives.push(key);
        }
      }
    });
    });
    if (this.selectedMarkers.length > 0 ){
        this.selected = true; // positions can be purchased
    }
    this.positionService.addSelectedMarker(this.selectedMarkers);
    this.archiveService.addSelectedArchives(this.selectedArchives);
  }
  deletePositions(): void {
    this.map.eachLayer(l => {
      if (l instanceof L.Marker && l.getPopup() != null) {
        this.map.removeLayer(l);
      }});
  }
  /*RESET BUTTON*/
  removeAreaSelection(): void{
    this.map.eachLayer(l => {
      if (l instanceof L.CircleMarker && l.getPopup() != null) {
        this.map.removeLayer(l);
      }
      if (l instanceof  L.Polygon) { this.map.removeLayer(l); }
    });
    this.selected = false;
    this.positionService.addSelectedMarker(null);
    this.selectedMarkers = [];
    this.showControlLayer = true;
    this.disableAddButton = false;
  }
  // select area through coordinates
  addSelectionPoint(): void{
    const marker = L.circleMarker([this.position.lat, this.position.lng],
      {radius: 4, color: 'rgba(192,0,61,0.71)', fillColor: '#0040c0', fillOpacity: 1.0}); // add the marker onclick
    marker.bindPopup(this.popupBody(this.position));
    this.purchaseArea.addLayer(marker);
    this.purchaseArea.addTo(this.map);
    this.disableFinishButton = false;
    console.log(this.purchaseArea);
  }
  drawPolygon(): void{
    const latlngs = [];
    this.purchaseArea.eachLayer((l: L.Marker) => latlngs.push(l.getLatLng()));
    const poly = L.polygon(latlngs).addTo(this.map);
    this.getArchivesInPolygon(poly);
    this.disableFinishButton = true;
  }

  isMarkerInsidePolygon(marker, polyPoints): boolean {
    const x = marker.getLatLng().lat;
    const y = marker.getLatLng().lng;
    let inside = false;
    for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
      const xi = polyPoints[i].lat;
      const yi = polyPoints[i].lng;
      const xj = polyPoints[j].lat;
      const yj = polyPoints[j].lng;
      const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) {
        inside = !inside;
        console.log(inside);
      }
    }
    return inside;
  }

  getMapBounds(): Position[]{
    this.bottomLeft.latitude = this.map.getBounds().getSouthWest().lat;
    this.bottomLeft.longitude = this.map.getBounds().getSouthWest().lng;
    this.topRight.latitude = this.map.getBounds().getNorthEast().lat;
    this.topRight.longitude = this.map.getBounds().getNorthEast().lng;
    return [this.topRight, this.bottomLeft];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.positionService.addSelectedMarker(null); // clear selection
    this.map.off();
    this.map.remove();
    console.log('ADIEU');
  }

}
