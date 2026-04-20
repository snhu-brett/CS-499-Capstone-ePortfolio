import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripCardComponent } from '../trip-card/trip-card.component';

import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrl: './trip-listing.component.css'
})
export class TripListingComponent implements OnInit {

  trips: Trip[] = [];
  message: string = '';
  errorMessage: string = '';

  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 3;

  searchTerm: string = '';
  sortOption: string = 'nameAsc';

  constructor(
    private tripDataService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  public loadTrips(): void {
    this.tripDataService.getTrips(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      this.sortOption
    ).subscribe({
      next: (response: any) => {
        this.trips = response.trips;
        this.totalPages = response.pages;
        this.errorMessage = '';
        this.message = response.total > 0
          ? `Showing page ${response.page} of ${response.pages}.`
          : 'No matching trips were found.';
      },
      error: () => {
        this.trips = [];
        this.message = '';
        this.errorMessage = 'Unable to load trips right now. Please try again later.';
      }
    });
  }

  public applyFilters(): void {
    this.currentPage = 1;
    this.loadTrips();
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTrips();
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTrips();
    }
  }

  ngOnInit(): void {
    this.loadTrips();
  }
}