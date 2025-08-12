import { Injectable } from '@nestjs/common';
import { getSDK, CbEvents, WSEvent } from '@openim/wasm-client-sdk';

@Injectable()
export class Chat {
  private readonly OpenIM = getSDK();
  constructor() {
    this.OpenIM.on(CbEvents.OnConnecting, this.handleConnecting);
    this.OpenIM.on(CbEvents.OnConnectFailed, this.handleConnectFailed);
    this.OpenIM.on(CbEvents.OnConnectSuccess, this.handleConnectSuccess);
  }

  login(userID: string, token: string) {
    this.OpenIM.login({
      userID,
      token,
      platformID: 5,
      apiAddr: 'http://your-server-ip:10002',
      wsAddr: 'ws://your-server-ip:10001',
    });
  }

  handleConnecting() : void {
    // Connecting...
  }
  
  handleConnectFailed({ errCode, errMsg }: WSEvent) : void {
    // Connection failed ❌
    console.log(errCode, errMsg);
  }
  
  handleConnectSuccess() : void {
    // Connection successful ✅
  }
}
