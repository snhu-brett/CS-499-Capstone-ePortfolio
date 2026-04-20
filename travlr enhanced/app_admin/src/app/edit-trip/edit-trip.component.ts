import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css'
})
export class EditTripComponent implements OnInit {

  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';
  formError: string = '';
  originalTripCode: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) { }

  ngOnInit(): void {
    const tripCode = localStorage.getItem('tripCode');

    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    this.originalTripCode = tripCode;

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.tripDataService.getTrip(tripCode)
      .subscribe({
        next: (value: any) => {
          this.trip = value;
          this.editForm.patchValue(value);
          this.message = `Trip ${tripCode} retrieved.`;
          this.formError = '';
        },
        error: () => {
          this.formError = 'Unable to load trip details.';
        }
      });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.formError = '';

    if (!this.editForm.valid) {
      this.formError = 'Please correct the highlighted fields before saving.';
      return;
    }

    this.tripDataService.updateTrip(this.originalTripCode, this.editForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error: any) => {
          this.formError = error?.error?.message || 'Unable to update trip.';
        }
      });
  }

  get f() {
    return this.editForm.controls;
  }

}