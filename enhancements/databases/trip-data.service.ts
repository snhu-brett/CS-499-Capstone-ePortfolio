import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {

  baseUrl = 'http://localhost:3000/api';
  private tripsUrl = this.baseUrl + '/trips';

  constructor(private http: HttpClient) {}

  getTrips(page: number = 1, limit: number = 3, search: string = '', sort: string = 'nameAsc'): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('search', search)
      .set('sort', sort);

    return this.http.get<any>(this.tripsUrl, { params });
  }

  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.tripsUrl, formData);
  }

  getTrip(tripCode: string): Observable<Trip> {
    return this.http.get<Trip>(this.tripsUrl + '/' + encodeURIComponent(tripCode));
  }

  updateTrip(originalCode: string, formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(
      this.tripsUrl + '/' + encodeURIComponent(originalCode),
      formData
    );
  }

  deleteTrip(tripCode: string): Observable<any> {
    return this.http.delete(
      this.tripsUrl + '/' + encodeURIComponent(tripCode)
    );
  }

  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, passwd);
  }

  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, passwd);
  }

  handleAuthAPICall(endpoint: string, user: User, passwd: string): Observable<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };

    return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint, formData);
  }
}