import {AfterViewInit, Component, OnInit, ViewChild, Input, OnChanges} from '@angular/core';
import {ArchiveService} from '../_services/archive.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Position} from '../_models/Position';
import {ArchiveCancelDialogComponent} from './archive-cancel-dialog/archive-cancel-dialog.component';
import {ArchiveDetailsDialogComponent} from './archive-details-dialog/archive-details-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PositionService} from '../_services/position.service';
import {Archive} from "../_models/Archive";

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.css']
})
export class ArchivesComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() accountId !: string;
  archives = [];
  // displayedColumns: string[] = ['lat', 'lng', 'createdAt', 'actions'];
  displayedColumns: string[] = ['ArchiveId', 'CreatedBy','Purchases', 'Actions'];
  dataSource = new MatTableDataSource();
  loading = false; // Flag variable
  file: File = null; // Variable to store file
  enableUpload = false;
  noArchives = true;
  myFiles: any[] = [];
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required])
  });
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor( private archiveService: ArchiveService,
               private positionService: PositionService,
               private dialog: MatDialog,
               private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes): void {
    if (changes.accountId) {
      // async view update
      this.accountId = changes.accountId;
    }
    this.getArchives();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getArchives(): void{
    this.archiveService.getArchives().subscribe(
      (alist: any) => {
        console.log(alist);
        this.archives = [];
        alist.forEach(a => this.archives.push(a) );
        this.dataSource.data = this.archives ;
        if( alist.length >0) {
          this.noArchives = false;
        }
      }, err =>
        this.snackBar.open('Error!', 'Close', {duration: 6000})
      );
  }
  reload(): void {
    this.archiveService.getArchives().subscribe( items => {
        this.dataSource.data = items;
      },
      err => {
        console.log('Error retrieving data', err);
      });
  }
  removeDialog(archive: Archive): void {
    const dialogRef = this.dialog.open(ArchiveCancelDialogComponent, {
      data: archive
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.archiveService.cancelArchive(archive.id).subscribe(req => {
              this.snackBar.open('Removed!', 'Close', {duration: 800});
              this.reload();
          },
          err => {
            this.snackBar.open('Error', 'Close', {duration: 800});
          });
      }
    });
  }
  detailsDialog(archive: Archive): void {
    const dialogRef = this.dialog.open(ArchiveDetailsDialogComponent, {
      data: archive
    });
    dialogRef.afterClosed().subscribe(res => {
      if ( res ) {
        this.removeDialog(res);
      }
    });
  }
  /***** UPLOAD SECTION ****/
  onUpload(): void {
    this.loading = !this.loading;
    this.myFiles.map(file => this.archiveService.upload(file).
      subscribe(
      (event: any) => {
        this.reload();
        this.snackBar.open('File uploaded successfully!', 'Close', {duration: 800});
      },
      error => { this.snackBar.open('Error uploading file!', 'Close', {duration: 1600}); }
    ));
    this.loading = false;
    this.myFiles = [];
  }
  get formControls(): any {
    return this.myForm.controls;
  }
  /*add new file name*/
  onFileChange(event: any): any {
    for (const file of  event.target.files) {
      if (! this.validateFile(file.name)){
        this.snackBar.open('Error: file must be .json extension.', 'Close', {duration: 6000});
      } else {
        this.myFiles.push(file);
      }
    }
    this.enableUpload = true;
  }
  validateFile(name: string): boolean {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    return ext.toLowerCase() === 'json';
  }
  removeFile(file): void {
    this.myFiles.forEach( (item, index) => {
      if (item === file) {this.myFiles.splice(index, 1); }
    });
    if ( this.myFiles.length === 0){
      this.enableUpload = false;
    }
  }
}
