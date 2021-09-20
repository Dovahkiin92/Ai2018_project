import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Position} from '../../_models/Position';
import * as moment from 'moment';
import {Archive} from "../../_models/Archive";

@Component({
  selector: 'app-archive-details-dialog',
  templateUrl: './archive-details-dialog.component.html',
  styleUrls: ['./archive-details-dialog.component.css']
})
export class ArchiveDetailsDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Archive) { }

  ngOnInit(): void {
  }
}
