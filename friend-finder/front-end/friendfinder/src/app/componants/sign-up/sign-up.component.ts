import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../service/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  // tslint:disable-next-line:ban-types
  messageAr: String = '';
  // tslint:disable-next-line:ban-types
  messageEn: String = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  togglePasswordVisibility(fieldId: string) {
    const field = document.getElementById(fieldId) as HTMLInputElement;
    const toggle = field.nextElementSibling as HTMLElement;

    if (field.type === 'password') {
      field.type = 'text';
      toggle.textContent = '🙈';
    } else {
      field.type = 'password';
      toggle.textContent = '👁️';
    }
  }
  login() {
    this.router.navigateByUrl('/login'); // rice
  }
  // tslint:disable-next-line:typedef
  disablePaste(event: ClipboardEvent) {
    event.preventDefault();
    alert('Pasting is disabled for security reasons');
  }
  // tslint:disable-next-line:typedef
  createAccount(name: string,
                phone: string,
                email: string,
                password: string,
                confirmPassword: string,
                age: string,
                gender: string) {

    // Existing validation checks...
    if (password !== confirmPassword) {
      this.messageEn = 'Passwords do not match.';
      this.messageAr = 'كلمات المرور غير متطابقة.';
      return;
    }

    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(password)) {
      this.messageEn = 'Password must be at least 8 characters long and include letters, numbers, and special characters.';
      this.messageAr = 'يجب أن تكون كلمة المرور مكونة من 8 أحرف على الأقل وتشمل حروفًا وأرقامًا ورموزًا خاصة.';
      return;
    }

    this.authService.createAccount(name, email, phone, password, age, gender).subscribe(

      (response) => {

        // Handle successful response

        this.router.navigateByUrl('/login');

      },

      (errorResponse) => {

        // Handle validation errors

        if (errorResponse && typeof errorResponse === 'object') {

          // Clear previous messages

          this.messageAr = '';

          this.messageEn = '';


          // Loop through the error object and set messages

          for (const [key, value] of Object.entries(errorResponse)) {

            // Assuming the value is a string message

            if (typeof value === 'string') {

              this.messageAr = value; // Assuming the error message is in Arabic

              this.messageEn = value; // Assuming the error message is in English

            } else if (typeof value === 'object') {

              // If the value is an object, you might want to handle it differently

              // For example, if it contains separate messages for Arabic and English

              // @ts-ignore
              this.messageAr = value.message_ar || ''; // Adjust based on your actual structure

              // @ts-ignore
              this.messageEn = value.message_en || ''; // Adjust based on your actual structure

            }

          }

        } else {

          // Handle other types of errors

          this.messageAr = 'An unexpected error occurred';

          this.messageEn = 'An unexpected error occurred';

        }

        this.extracted();

      }

    );

  }
  // tslint:disable-next-line:typedef
  private extracted() {
    setTimeout(() => {
      this.messageAr = '';
      this.messageEn = '';
    }, 3000);
  }
  disableCopy(event: ClipboardEvent) {
    event.preventDefault();
    alert('Copying and cutting from the password field is disabled for security reasons.');
  }
}
