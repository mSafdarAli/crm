import { Component, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewtaskPopupComponent } from './newtask-popup/newtask-popup.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
 
  constructor(
    @Optional() private dialogRef: MatDialogRef<NewtaskPopupComponent>,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.newDialog();
  }

  newDialog(id = null) {
    const DialogRef = this.dialog.open(NewtaskPopupComponent, {
      data: { id: id },
      width: '70%',
      height: '70%',
      disableClose: true,
    });
  }

}
