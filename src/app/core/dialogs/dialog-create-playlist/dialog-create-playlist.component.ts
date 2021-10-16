import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataCreatePlaylist } from '../../models/dialog-data-create-playlist.interface';

@Component({
  selector: 'app-dialog-create-playlist',
  templateUrl: './dialog-create-playlist.component.html',
  styleUrls: ['./dialog-create-playlist.component.scss']
})
export class DialogCreatePlaylistComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogCreatePlaylistComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogDataCreatePlaylist) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}