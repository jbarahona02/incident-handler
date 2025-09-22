import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { Incident } from '../../../../shared/interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class ReporterIncidentService {
  allIncidents : Incident[] = [];

  constructor(
    httpRequestService: HttpRequestService
  ){

  }

  

  
}
