import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Position} from '../_models/Position';
import {Invoice} from '../_models/Invoice';
import { Timeposition } from '../_models/Timeposition';
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private counter = 0;
  boughtPositions;

 /* Archives selected to be bought */
  selectedMarkers = [];
  selectedIds = [];
  selectedSubject = new Subject<any[]> ();

  //** position currently shown on map and time chart **//
  currentBounds = [];
  currentMarkers = [];
  currentSubject = new Subject<any[]>();
  currentTimestamps = [];
  currentTimeSubject = new Subject<any[]>();

  constructor(private auth:AuthenticationService, private http: HttpClient) { }
  /* save markers selected by polygon */
  addSelectedMarker(marker: any[]): void {
    this.selectedMarkers = [];
    if ( marker ){
    marker.forEach(m => {
      const pos = new  Position();
      pos.latitude = m.lat;
      pos.longitude = m. lng;
      pos.userId = '';
      pos.timestamp = 10000;
      this.selectedMarkers.push(pos);
    });
    } else {
      this.selectedMarkers.push('EMPTY');
    }
    this.selectedSubject.next(this.selectedMarkers);
    console.log('selected ' + this.selectedMarkers);
  }

  /* query data to server*/
  getMarkers(topRight: Position, bottomLeft: Position, start?, end?): void{
    let startTs = 0; // Min value date
    const date = new Date();
    let  endTs = date.getTime() / 1000; // now time
    if (start !== undefined && end !== undefined) { // time interval is defined
      startTs = start / 1000;
      endTs = end / 1000;
      if (endTs < startTs) {
        console.log('Invalid time range');
        return;
      }
    }
    this.currentBounds[0] = topRight;
    this.currentBounds[1] = bottomLeft;
    topRight.timestamp = 0;
    bottomLeft.timestamp = 0;
    topRight.userId = '';
    bottomLeft.userId = '';
    const requestBody = {
     'topRight': topRight,
      'bottomLeft': bottomLeft,
     'from': startTs,
      'to': endTs
    };
    const headers = new HttpHeaders({ 'Content-type': 'application/json; charset=utf-8'});
    this.http.post(environment.map_archives_url, JSON.stringify( requestBody), { headers }).subscribe((res: any) => {
      this.currentMarkers = [];
      this.currentTimestamps = [];
      // .filter(archive => archive.userId != this.auth.getUsername()).
      res.forEach(archive => {
        archive.approxPositions.forEach( el => {
          let pos = new Position() ;
          pos.latitude = el.latitude;
          pos.longitude = el.longitude;
          pos.userId = archive.userId;
          pos.archiveId = archive.id;
          this.currentMarkers.push(pos);
          console.log('added a marker', pos.latitude, pos.longitude);
      });
        archive.approxTimestamps.forEach( el =>{
          let pos = new Timeposition();
          pos.timestamp = el.timestamp;
          pos.userId = el.owner;
          this.currentTimestamps.push(pos);
        });
      });
      this.currentSubject.next(this.currentMarkers);
      this.currentTimeSubject.next(this.currentTimestamps);
    });
  }
  addBoughtPosition(positions: any): void{
    this.boughtPositions = positions;
  }
  /*** LABS FUNCTIONS***/
  buyPositions(positions: Position[]): Observable<Invoice>{
    return this.http.post<Invoice>(environment.positions_buy_url, (positions));
  }
  cancelPosition(position: Position): Observable<any> {
    return  this.http.post(environment.position_delete_url, position);
  }

  changeDateRange(from: any, to: any) {
    return this.getMarkers(this.currentBounds[0], this.currentBounds[1], from, to);
  }
}
