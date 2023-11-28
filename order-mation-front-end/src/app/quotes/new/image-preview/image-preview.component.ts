import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { QuoteService } from 'src/_services/rest/quote.service';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {

  image: string | SafeResourceUrl = null;
  id : number = null;
  constructor(private dialogRef: MatDialogRef<ImagePreviewComponent> , private dialog: MatDialog,@Inject(MAT_DIALOG_DATA) private data , private quotesService: QuoteService) {
  this.id = this.data.id;
  if(this.id){
    const sub = this.quotesService.getImage(this.id).subscribe({
      next: (res) => {
        this.image = res['data'].imageUrl;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  }

  ngOnInit(): void {
  }
  close() {
		this.dialogRef.close()
	}
  embedImage(){
    this.dialogRef.close(true);
  }
}
