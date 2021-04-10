import { Component, OnInit, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA
} from "@angular/material/snack-bar";

@Component({
  selector: 'app-snackbar-assignment',
  templateUrl: './snackbar-assignment.component.html',
  styleUrls: ['./snackbar-assignment.component.css']
})
export class SnackbarAssignmentComponent implements OnInit {

  constructor(public sbRef: MatSnackBarRef<SnackbarAssignmentComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
