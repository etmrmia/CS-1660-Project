import { Component, OnInit, computed, inject, ViewChild, ElementRef} from '@angular/core';
import { NgModule } from '@angular/core';
import { json } from 'stream/consumers';
import { CommonModule } from '@angular/common';
import { UserStore } from '../stores/user.store';
import { StudentAttendanceDisplay } from '../types/student-attendance-display.type';
import { CourseStore } from '../stores/course.store';
import { Html5Qrcode } from 'html5-qrcode';
import {Html5QrcodeScanner} from "html5-qrcode";
import { Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Html5QrcodeScanType } from 'html5-qrcode';
import { listenerCount } from 'events';

@Component({
    selector: 'app-qr-code',
    standalone:true,
    imports: [CommonModule],
    templateUrl: './qr-code.component.html',
    styleUrl: './qr-code.component.scss',
  })
  export class QrCodeComponent implements OnInit {
    urlToEncode!: string;
    scanFlag = false; // flag for button 
    readonly courseStore = inject(CourseStore);
    readonly userStore = inject(UserStore);
    course = this.courseStore.courseChosen;
    user = this.userStore.user;
    qrScannerVisible = true;
    html5QrcodeScanner!: Html5QrcodeScanner;
    isPresent = false; 


    ngOnInit(){
    if(this.user()?.isStudent){

        const studentJSON = {
          sectionNo: this.course()?.sectionNo,         // replace with current user's section number
          courseID: this.course()?.courseID,   // replace with current user's courseID
          studentID: this.user()?.id,         // replace with user's studentID
        }

        // TEST ENDPOINT 
        // const studentJSON = {
        //   sectionNo: 1,         // replace with current user's section number
        //   courseID: "CS1660",   // replace with current user's courseID
        //   studentID: 1,         // replace with user's studentID
        // }
        this.checkIfAttended(studentJSON);
      }
    else{
      console.log("IS PROFESSOR");
      this.getQrCodeURL();
      this.qrScannerVisible = false;
    } 
    }

    async checkIfAttended(studentData:any){
      // console.log("Checking to see if student attended in UI");
      // console.log(studentData);
      const response = await fetch('/getAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData)
      });
      const data = await response.json();
      
      // VERIFY ENDPOINT
      // console.log(data.attended);
      // console.log("CONVERTED ATTENDED");
      // Implement if here: if respone is no then this.getQrCodeURL else this.clearHTML
      if(String(data.attended) === 'True'){
        this.clearHTML();
      } else{
        this.clearHTML();
        this.getQrCodeURL();
      }
      
    }

    async getQrCodeURL() {
      const jsonObject =  {
        sectionNo: this.course()?.sectionNo,               // replace with user's section number - not sure how to do this
        courseID: this.course()?.courseID,         // replace with user's courseID - not sure how to do this
        profID: this.course()?.professor.id
      }
      // TEST ENDPOINT 
      // const jsonObject =  {
      //   sectionNo: 1,               // replace with user's section number - not sure how to do this
      //   courseID: 'CS1660',         // replace with user's courseID - not sure how to do this
      //   profID: 1
      // }
      const response = await fetch('/qrcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonObject)
        
      });
      const data = await response.json();
      this.urlToEncode = data.qrCode; 
    }

    scanqrcode(){
      this.scanFlag = true;
      // console.log("IN METHOD");
      if(document.getElementById("qr-reader")){
        this.html5QrcodeScanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 
          { width: 250, 
            height: 250 
          }, 
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        }, 
        false);
        this.html5QrcodeScanner.render((text: any, result: any) => this.onScanSuccess(text, result), (err: any)=>this.onScanFail(err));
    }
      }
      
    onScanSuccess(text: any, result: any) {
      this.html5QrcodeScanner.clear();
      // console.log("Text is ");
      console.log(text);
      // console.log("Result is");
      // console.log(result);
      // Remove corresponding elements in the HTML file 
      let removeElement = document.getElementById("qr-reader");
      if(removeElement)
        removeElement.remove(); 
      removeElement = document.getElementById("qrcode");
      if(removeElement)
        removeElement.remove();
      removeElement = document.getElementById("testqr");
      if(removeElement)
        removeElement.remove();

      this.isPresent = true; 
      this.postResult(text);
  }

  clearHTML(){
    let removeElement = document.getElementById("qr-reader");
    if(removeElement)
      removeElement.remove(); 
    removeElement = document.getElementById("qrcode");
    if(removeElement)
      removeElement.remove();
    removeElement = document.getElementById("testqr");
    if(removeElement)
      removeElement.remove();

    this.isPresent = true; 
  }
 
  async postResult(result:any){
    const jsonObject = JSON.parse(result);
    jsonObject.studentID = this.user()?.id;
    delete jsonObject.profID; 
    // console.log("Recording attendance");
    // console.log(jsonObject);

    // TEST DATA 
    // const studentJSON = {
    //   sectionNo: 1,         // replace with current user's section number
    //   courseID: "CS1660",   // replace with current user's courseID
    //   studentID: 1,         // replace with user's studentID
    // }
    
    const response = await fetch('/recordAttendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonObject),
    });
  }
  
  onScanFail(err:any){
    console.log(err);
  }

  }

