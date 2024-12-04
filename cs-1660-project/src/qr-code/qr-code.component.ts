import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { json } from 'stream/consumers';


@Component({
    selector: 'app-qr-code',
    standalone: true,
    templateUrl: './qr-code.component.html',
    styleUrl: './qr-code.component.scss',
  })
  export class QrCodeComponent implements OnInit {
    
    urlToEncode!: string;
      
    ngOnInit() {
      this.getQrCodeURL();
    }

    async getQrCodeURL() {
      const response = await fetch('/qrcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
      });
     
      const data = await response.json();
      this.urlToEncode = data.qrCode; 
    }
   
  }