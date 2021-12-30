import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Server } from '../models/server';
import { ServerService } from '../services/server.service';
import { AuthResponse } from '../models/authResponse';

@Injectable()
export class LoginGuard implements CanActivate {
    constructor(
      private serverService: ServerService,
      private loginService: LoginService,
      private router: Router
    ) {}

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const server_id = next.paramMap.get('server_id');
        let server = await this.serverService.get(parseInt(server_id, 10));
        // server.username = "admin";
        // server.password = "admin";
        // await this.loginService.login(server, server.username, server.password).toPromise().then(async (response: AuthResponse) => {
        //     server.authToken = response.access_token;
        //     await this.serverService.update(server);
        // });

        if (server.authToken) {
            return true;
        } else {
            this.router.navigate(['/server', server.id, 'login'], { queryParams: { returnUrl: state.url }});
        }
    }
}
