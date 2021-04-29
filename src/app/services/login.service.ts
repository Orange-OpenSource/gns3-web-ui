import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Server } from '../models/server';
import { HttpServer } from './http-server.service';
import { AuthResponse } from '../models/authResponse';

@Injectable()
export class LoginService {
  constructor(private httpServer: HttpServer) {}

  login(server: Server, username: string, password: string) {
    const payload = new HttpParams()
        .set('username', username)
        .set('password', password);

    const options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.httpServer.post<AuthResponse>(server, '/users/login', payload, options);
  }
}
