import { Injectable } from '@angular/core';
import { HttpRequestService } from '../../../../shared/services/http-request/http-request.service';
import { ConstantsEndpoints } from '../../../../shared/constants/constants-endpoints';
import { LoginResponse } from '../../../authentication/interfaces';
import { AuthConstants } from '../../../authentication/constants/auth-constants';

const authMicroService = ConstantsEndpoints.AUTH_MICROSERVICE;

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(
    private httpRequestService: HttpRequestService
  ){

  }

  async login(body: bodyLogin) : Promise<LoginResponse> {
    return await this.httpRequestService.post(authMicroService,AuthConstants.LOGIN,body) as LoginResponse;
  }
}

interface bodyLogin {
  email: string;
  password: string;
}