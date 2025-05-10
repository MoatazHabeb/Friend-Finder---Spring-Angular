import { Component, OnInit } from '@angular/core';
import {ContactService} from "../../../service/contact.service";
import {Contact} from "../../../model/contact";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent  {

  contact: Contact = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  message: { text: string, type: string } | null = null;
  constructor(private contactInfoService: ContactService) {}

  onSubmit(): void {
    if (this.contact.name && this.contact.email && this.contact.subject && this.contact.message) {
      this.contactInfoService.saveMessage(this.contact).subscribe(
        (response) => {
          // Set the success message
          this.message = {
            text: 'Message sent successfully!',
            type: 'alert-success'
          };
          // Optionally reload the page and clear the form data after some delay
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        (error) => {
          // Set the error message
          this.message = {
            text: 'Failed to send message. Please try again later.',
            type: 'alert-danger'
          };
        }
      );
    } else {
      // Display a message if the form is not complete
      this.message = {
        text: 'Please fill out all required fields.',
        type: 'alert-danger'
      };
    }
  }
}

