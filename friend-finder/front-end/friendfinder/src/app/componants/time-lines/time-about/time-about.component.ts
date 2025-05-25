import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserDetailsDto, UserDetailsService} from "../../../../service/user-details.service";

@Component({
  selector: 'app-time-about',
  templateUrl: './time-about.component.html',
  styleUrls: ['./time-about.component.css']
})
export class TimeAboutComponent implements OnInit {

  isEditMode = false;
  userDetailsForm!: FormGroup;
  userData!: UserDetailsDto;

  relationships = ['Single', 'In a Relationship', 'Married'];
  languagesList = ['English', 'Russian', 'French', 'Arabic'];
  interestsList = ['Photography', 'Traveling', 'Shopping', 'Cycling', 'Eating'];

  constructor(private fb: FormBuilder, private userService: UserDetailsService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserDetails();
  }

  initForm(): void {
    this.userDetailsForm = this.fb.group({
      bio: [''],
      work: [''],
      city: [''],
      relationship: [''],
      highSchool: [''],
      college: [''],
      birthday: [''],
      languages: this.fb.array([]),
      interests: this.fb.array([])
    });
  }

  loadUserDetails(): void {
    this.userService.getUserDetails().subscribe(data => {
      this.userData = data; // used for display mode

      this.userDetailsForm.patchValue({
        bio: data.bio,
        work: data.work,
        city: data.city,
        relationship: data.relationship,
        highSchool: data.highSchool,
        college: data.college,
        birthday: data.birthday
      });

      this.setMultiSelect('languages', data.languages?.map(l => l.language));
      this.setMultiSelect('interests', data.interests?.map(i => i.interest));
    });
  }

  setMultiSelect(controlName: 'languages' | 'interests', values: string[] = []): void {
    const formArray = this.userDetailsForm.get(controlName) as FormArray;
    formArray.clear();
    values.forEach(value => formArray.push(new FormControl(value)));
  }

  onCheckboxChange(event: any, controlName: 'languages' | 'interests') {
    const formArray = this.userDetailsForm.get(controlName) as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.target.value);
      if (index >= 0) formArray.removeAt(index);
    }
  }

  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  submit(): void {
    const formValue = this.userDetailsForm.value;

    const userDetailsDto: UserDetailsDto = {
      ...formValue,
      languages: formValue.languages.map((l: string) => ({ language: l })),
      interests: formValue.interests.map((i: string) => ({ interest: i }))
    };

    this.userService.saveUserDetails(userDetailsDto).subscribe(() => {
      alert('Details updated successfully!');
      this.toggleEdit(); // Switch back to view mode
      this.loadUserDetails(); // Refresh
    });
  }
}
