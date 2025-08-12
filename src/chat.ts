import { Injectable,Logger } from '@nestjs/common';
import { getSDK, CbEvents, WSEvent } from '@openim/wasm-client-sdk';
import * as path from 'path';

const apiAddr = 'http://127.0.0.1:10002';
const wsAddr = 'ws://127.0.0.1:10001';

const coreWasmPath = path.resolve(__dirname, '../assets/openim.wasm');
const sqlWasmPath = path.resolve(__dirname, '../assets/sql-wasm.wasm');

const config = {
  coreWasmPath: coreWasmPath,
  sqlWasmPath: sqlWasmPath,
  debug: true,
};

@Injectable()
export class Chat {
  private readonly OpenIM = getSDK(config);
  private readonly logger = new Logger(Chat.name);
  constructor() {
    this.logger.log('Chat constructor', coreWasmPath);
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
