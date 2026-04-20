import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.css'
})
export class AddTripComponent implements OnInit {

  addForm!: FormGroup;
  submitted = false;
  formError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) { }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.formError = '';

    if (!this.addForm.valid) {
      this.formError = 'Please correct the highlighted fields before saving.';
      return;
    }

    this.tripService.addTrip(this.addForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error: any) => {
          this.formError = error?.error?.message || 'Unable to save trip.';
        }
      });
  }

  get f() {
    return this.addForm.controls;
  }

}