import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, Subject} from 'rxjs';
import {Position} from '../_models/Position';
import {environment} from '../../environments/environment';
import {Invoice} from '../_models/Invoice';
import {stringify} from '@angular/compiler/src/util';
import {Archive} from "../_models/Archive";

@Injectable()
export class ArchiveService {
  selectedArchivesSubject = new Subject<any[]> ();
  selectedArchives = []; // list of archives selected to be bought
  boughtArchives = [];
  constructor(private http: HttpClient) {
  }
   addSelectedArchives(ids: any[]): void {
    this.selectedArchives = [];
    if ( ids ){
      ids.forEach(id => {
        this.selectedArchives.push(id);
      });
    } else {
      this.selectedArchives.push('EMPTY');
    }
    this.selectedArchivesSubject.next(this.selectedArchives);
    console.log('selected ' + this.selectedArchives);
  }
  addBoughtArchives(ids: any[]): void{
    this.boughtArchives= ids;
  }

  buyArchives(archiveIds: string[]): Observable<Invoice>{
    return this.http.post<Invoice>(environment.archives_buy_url,archiveIds);
  }

  getArchives(): Observable<any> {
   // return this.http.get('../../assets/positions.json');
    return this.http.get(environment.archives_url);
  }

  cancelArchive(archiveId: string): Observable<any> {
    return this.http.delete(environment.archives_delete_url.replace('{id}', archiveId));
  }

  upload(file ): Observable<any> {
    // Make http post request over api
    // with formData as req
   return this.http.post(environment.archives_upload_url, file);
  }
}
