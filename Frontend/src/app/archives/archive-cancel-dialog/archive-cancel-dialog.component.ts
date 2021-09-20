import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Position} from '../../_models/Position';
import {Archive} from "../../_models/Archive";

@Component({
  selector: 'app-archive-cancel-dialog',
  templateUrl: './archive-cancel-dialog.component.html',
  styleUrls: ['./archive-cancel-dialog.component.css']
})
export class ArchiveCancelDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Archive) { }

  ngOnInit(): void {
  }
}
