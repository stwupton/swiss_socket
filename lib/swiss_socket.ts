import * as http from 'http';
import {WebSocket, Server} from 'ws';

module SwissSocket {

  import SocketPool = SwissSocket.SocketPool;

  export class SwissSocket {

    address: string;
    port: number;
    server: Server;
    socketPools: Array<SocketPool> = [];

    constructor(address: string, port: number = 80, max: number = 0) {
      this.address = address;
      this.port = port;
    }


    public start(): void {

      this.server = new Server({host: this.address, port: this.port}, () => {

        console.log(`Swiss Socket server listening on port: ${this.server.options.port}, host: ${this.server.options.host}`);

        this.server.on('connection', (webSocket: WebSocket): void => {

          let pools: Array<SocketPool> = this.socketPools.filter(
              (pool: SocketPool) => pool.identifier == webSocket.upgradeReq.url);

          if (pools.length > 0)
            pools[0].addSocket(webSocket);

        });

      });

    }

  }

}
