import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
@Injectable()
export class SocketService {
  public _socket: any;
  isBrowser;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      if (environment.production) {
        this._socket = require('socket.io-client')();
      } else {
        this._socket = require('socket.io-client')('http://localhost:4000');
        console.log('socket loaded dev');
      }
      this.addOnAll();
    }
  }
  get socket() {
    return this._socket;
  }
  private addOnAll() {
    const onevent = this._socket.onevent;
    this._socket.onevent = function (packet) {
      const args = packet.data || [];
      onevent.call(this, packet);    // original call
      packet.data = ["*"].concat(args);
      onevent.call(this, packet);      // additional call to catch-all
    };
  }
}
