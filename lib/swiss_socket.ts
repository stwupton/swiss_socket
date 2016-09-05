import {SocketPool, WebSocket, Server} from './socket_pool';

export class SocketServer {

  host: string;
  port: number;
  server: Server;
  socketPools: SocketPool[] = [];

  private maxSockets: number;
  private maxPools: number;

  constructor(
      host: string = '0.0.0.0',
      port: number = 0,
      maxPools: number = 10,
      maxSockets: number = 20) {

    this.host = host;
    this.port = port;
    this.maxPools = maxPools;
    this.maxSockets = maxSockets;

  }

  private getQueryParameters(query: string): {} {

    let parameters: {} = {};

    let params: string[] = query.split('&');
    for (let i = 0; i < params.length; i++) {
      let param: string[] = params[i].split('=');
      if (param[0])
        parameters[param[0]] = param[1];
    }

    return parameters;

  }

  public start(): void {

    this.server = new Server({host: this.host, port: this.port}, () => {

      this.host = this.server._server.address().address;
      this.port = this.server._server.address().port;
      console.log(`Swiss Socket server listening on port: ${this.port}, host: ${this.host}`);

      this.server.on('connection', (webSocket: WebSocket): void => {

        // Get existing pool with identifier.
        let pools: SocketPool[] = this.socketPools.filter(
            (pool: SocketPool) => pool.identifier == webSocket.upgradeReq.url);

        let pool: SocketPool;
        if (pools.length > 0) {
          pool = pools[0];
        } else {

          if (this.socketPools.length == this.maxPools) {
            webSocket.send(JSON.stringify({_ss_error: 'Maximum socket pools reached.'}));
            webSocket.close();
            return;
          }

          // Get socket pool identifier and maximum sockets cap from query parameter.
          let maxSockets: number = this.maxSockets;
          let identifier: string = webSocket.upgradeReq.url;
          if (identifier.search(new RegExp('\\?', 'g')) != -1) {

            let urlSplit: string[] = identifier.split('?');
            identifier = urlSplit[0];

            let query: {} = this.getQueryParameters(urlSplit[1]);
            if (query['max'] != null &&
                query['max'].length > 0 &&
                !isNaN(parseInt(query['max'])))
              maxSockets = parseInt(query['max']);

          }

          // Check that the 'max' parameter specifies does not exceed the maximum
          // defined when creating server.
          if (maxSockets > this.maxSockets) {
            webSocket.send(JSON.stringify({_ss_error: `Cannot specify a maximum of more than ${this.maxSockets}.`}));
            webSocket.close();
            return;
          }

          pool = new SocketPool(identifier, maxSockets);
          this.socketPools.push(pool);

        }

        let successful: boolean = pool.addSocket(webSocket);
        if (!successful) {
          webSocket.send(JSON.stringify({_ss_error: 'Maximum sockets reached.'}));
          webSocket.close();
          return;
        }

        // Remove socket pool when all `WebSocket`'s have disconnected.
        webSocket.on('close', () => {

          let disconnected: WebSocket[] = pool.clients.filter((ws: WebSocket) =>
              ws.readyState == ws.CLOSED);

          if (disconnected.length == pool.clients.length)
            this.socketPools.splice(this.socketPools.indexOf(pool), 1);

        });

      });

    });

  }

}
