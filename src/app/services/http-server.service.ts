import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Server, ServerProtocol } from '../models/server';
import { AuthResponse } from '../models/authResponse';
import { ServerService } from './server.service';

/* tslint:disable:interface-over-type-literal */
export type JsonOptions = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
};

export type TextOptions = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType: 'text';
  withCredentials?: boolean;
};

export type BlobOptions = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType: 'blob';
  withCredentials?: boolean;
};

export type HeadersOptions = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
};
/* tslint:enable:interface-over-type-literal */

export class ServerError extends Error {
  public originalError: Error;

  constructor(message: string) {
    super(message);
  }

  static fromError(message: string, originalError: Error) {
    const serverError = new ServerError(message);
    serverError.originalError = originalError;
    return serverError;
  }
}

@Injectable()
export class ServerErrorHandler {
  handleError(error: HttpErrorResponse, httpServer: HttpServer, server: Server) {
    let err: Error = error;

    if (error.name === 'HttpErrorResponse' && error.status === 0) {
      err = ServerError.fromError('Server is unreachable', error);
    }

    if (error.name === 'HttpErrorResponse' && error.status === 401) {
      const payload = new HttpParams()
        .set('username', "admin")//server.username)
        .set('password', "admin");//server.password);
      const options = {
          headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      };
      httpServer.post<AuthResponse>(server, '/users/login', payload, options).subscribe(async (response: AuthResponse) => {
        server.authToken = response.access_token;
      });
      return;
    }

    return throwError(err);
  }
}

@Injectable()
export class HttpServer {
  public requestsNotificationEmitter = new EventEmitter<string>();

  constructor(private http: HttpClient, private errorHandler: ServerErrorHandler) {}

  get<T>(server: Server, url: string, options?: JsonOptions): Observable<T> {
    options = this.getJsonOptions(options);
    const intercepted = this.getOptionsForServer<JsonOptions>(server, url, options);
    this.requestsNotificationEmitter.emit(`GET ${intercepted.url}`);

    return this.http
      .get<T>(intercepted.url, intercepted.options as JsonOptions)
      .pipe(catchError<T, any>(n => this.errorHandler.handleError(n, this, server))) as Observable<T>;
  }

  getText(server: Server, url: string, options?: TextOptions): Observable<string> {
    options = this.getTextOptions(options);
    const intercepted = this.getOptionsForServer<TextOptions>(server, url, options);
    this.requestsNotificationEmitter.emit(`GET ${intercepted.url}`);

    return this.http
      .get(intercepted.url, intercepted.options as TextOptions)
      .pipe(catchError(n => this.errorHandler.handleError(n, this, server)));
  }

  getBlob(server: Server, url: string, options?: BlobOptions): Observable<Blob> {
    options = this.getBlobOptions(options);
    const intercepted = this.getOptionsForServer<BlobOptions>(server, url, options);
    this.requestsNotificationEmitter.emit(`GET ${intercepted.url}`);

    return this.http
      .get(intercepted.url, intercepted.options as BlobOptions)
      .pipe(catchError(n => this.errorHandler.handleError(n, this, server)));
  }

  post<T>(server: Server, url: string, body: any | null, options?: JsonOptions): Observable<T> {
    options = this.getJsonOptions(options);
    const intercepted = this.getOptionsForServer(server, url, options);
    this.requestsNotificationEmitter.emit(`POST ${intercepted.url}`);

    return this.http
      .post<T>(intercepted.url, body, intercepted.options)
      .pipe(catchError<T, any>(n => this.errorHandler.handleError(n, this, server))) as Observable<T>;
  }

  put<T>(server: Server, url: string, body: any, options?: JsonOptions): Observable<T> {
    options = this.getJsonOptions(options);
    const intercepted = this.getOptionsForServer(server, url, options);
    this.requestsNotificationEmitter.emit(`PUT ${intercepted.url}`);

    return this.http
      .put<T>(intercepted.url, body, intercepted.options)
      .pipe(catchError<T, any>(n => this.errorHandler.handleError(n, this, server))) as Observable<T>;
  }

  delete<T>(server: Server, url: string, options?: JsonOptions): Observable<T> {
    options = this.getJsonOptions(options);
    const intercepted = this.getOptionsForServer(server, url, options);
    this.requestsNotificationEmitter.emit(`DELETE ${intercepted.url}`);

    return this.http
      .delete<T>(intercepted.url, intercepted.options)
      .pipe(catchError<T, any>(n => this.errorHandler.handleError(n, this, server))) as Observable<T>;
  }

  patch<T>(server: Server, url: string, body: any, options?: JsonOptions): Observable<T> {
    options = this.getJsonOptions(options);
    const intercepted = this.getOptionsForServer(server, url, options);
    return this.http
      .patch<T>(intercepted.url, body, intercepted.options)
      .pipe(catchError<T, any>(n => this.errorHandler.handleError(n, this, server))) as Observable<T>;
  }

  head<T>(server: Server, url: string, options?: JsonOptions): Observable<T> {
    options = this.getJsonOptions(options);
    const intercepted = this.getOptionsForServer(server, url, options);
    return this.http
      .head<T>(intercepted.url, intercepted.options)
      .pipe(catchError<T, any>(n => this.errorHandler.handleError(n, this, server))) as Observable<T>;
  }

  options<T>(server: Server, url: string, options?: JsonOptions): Observable<T> {
    options = this.getJsonOptions(options);
    const intercepted = this.getOptionsForServer(server, url, options);
    return this.http
      .options<T>(intercepted.url, intercepted.options)
      .pipe(catchError<T, any>(n => this.errorHandler.handleError(n, this, server))) as Observable<T>;
  }

  private getJsonOptions(options: JsonOptions): JsonOptions {
    if (!options) {
      return {
        responseType: 'json',
      };
    }
    return options;
  }

  private getTextOptions(options: TextOptions): TextOptions {
    if (!options) {
      return {
        responseType: 'text',
      };
    }
    return options;
  }

  private getBlobOptions(options: BlobOptions): BlobOptions {
    if (!options) {
      return {
        responseType: 'blob',
      };
    }
    return options;
  }

  private getOptionsForServer<T extends HeadersOptions>(server: Server, url: string, options: T) {
    if (server.host && server.port) {
      if (!server.protocol) {
        server.protocol = location.protocol as ServerProtocol;
      }
      url = `${server.protocol}//${server.host}:${server.port}/v3${url}`;
    } else {
      url = `/v3${url}`;
    }

    if (!options.headers) {
      options.headers = {};
    }

    if (server.authToken) {
      options.headers['Authorization'] = `Bearer ${server.authToken}`;
    }

    return {
      url: url,
      options: options,
    };
  }
}
