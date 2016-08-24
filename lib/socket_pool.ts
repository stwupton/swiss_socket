import {WebSocket, Server} from 'ws';
export {WebSocket, Server};

export class SocketPool {

  public identifier: string;
  public clients: WebSocket[] = [];
  public disconnected: number = 0;

  constructor(identifier: string) {
    this.identifier = identifier;
  }

  public addSocket(webSocket: WebSocket): void {

    // Add `WebSocket` and send initial ID.
    this.clients.push(webSocket);
    webSocket.send(`{"_ss_id": ${this.clients.indexOf(webSocket)}}`);

    // Braodcast message to all open `WebSocket`'s in this pool.
    webSocket.on('message', (message: string) => {
      this.clients
        .filter((ws: WebSocket) => ws != webSocket)
        .forEach((ws: WebSocket) => {
          if (ws.readyState == ws.OPEN)
            ws.send(`{"_ss_id": ${this.clients.indexOf(webSocket)}, "message": ${message}}`);
        });
    });

  }

}
