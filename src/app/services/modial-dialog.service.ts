import { MatDialog } from "@angular/material";
import { Injectable } from '@angular/core';

@Injectable()
export class ModialDialogService {
  constructor(public dialog: MatDialog) {
  }
  public openDialog(dialogComponent, data?): void {
    const options = { width: '18em' };
    if (data)
      options['data'] = data;
    this.dialog.open(dialogComponent, options);
  }
  public openDialogLarge(dialogComponent, data?): void {
    const options = { width: '50em' };
    if (data)
      options['data'] = data;
    this.dialog.open(dialogComponent, options);
  }
}
