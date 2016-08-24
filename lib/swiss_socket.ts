import {SocketPool, WebSocket, Server} from './socket_pool';

export class SocketServer {

  host: string;
  port: number;
  server: Server;
  socketPools: SocketPool[] = [];

  constructor(host: string = '0.0.0.0', port: number = 0) {
    this.host = host;
    this.port = port;
  }

  public start(): void {

    this.server = new Server({host: this.host, port: this.port}, () => {

      console.log(`Swiss Socket server listening on port: ${this.server._server.address().port}, host: ${this.server._server.address().address}`);

      this.server.on('connection', (webSocket: WebSocket): void => {

        // Get existing pool with identifier.
        let pools: SocketPool[] = this.socketPools.filter(
            (pool: SocketPool) => pool.identifier == webSocket.upgradeReq.url);

        let pool: SocketPool;
        if (pools.length > 0) {
          pool = pools[0];
        } else {
          pool = new SocketPool(webSocket.upgradeReq.url)
          this.socketPools.push(pool);
        }

        pool.addSocket(webSocket);

        // Remove socket pool when all `WebSocket`'s have disconnected.
        webSocket.on('close', () => {
          pool.disconnected++;
          if (pool.disconnected == pool.clients.length)
            delete this.socketPools[this.socketPools.indexOf(pool)];
        });

        webSocket.send(JSON.stringify(this.server.options));

      });

    });

  }

}
