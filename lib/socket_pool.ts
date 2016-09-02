import {WebSocket, Server} from 'ws';
export {WebSocket, Server};

export class SocketPool {

  public identifier: string;
  public clients: WebSocket[] = [];

  private maxSockets: number;

  constructor(identifier: string, maxSockets: number) {
    this.identifier = identifier;
    this.maxSockets = maxSockets;
  }

  public addSocket(webSocket: WebSocket): boolean {

    let disconnected: WebSocket[] =
      this.clients.filter((ws: WebSocket) => ws.readyState == ws.CLOSED);

    // Add web socket if maximum sockets is not reached.
    if (disconnected.length == 0 && this.clients.length == this.maxSockets)
      return false;
    else if (disconnected.length > 0)
      this.clients[this.clients.indexOf(disconnected[0])] = webSocket;
    else
      this.clients.push(webSocket);

    // Send initial ID.
    let clientId = this.clients.indexOf(webSocket);
    webSocket.send(JSON.stringify({_ss_id: clientId}));

    // Braodcast message to all open `WebSocket`'s in this pool.
    webSocket.on('message', (message: string) => {
      let toBroadcast: string = `{"_ss_id": ${clientId}, "message": ${message}}`;
      this.broadcast(webSocket, toBroadcast);
    });

    // Let all clients know that socket has disconnected.
    webSocket.on('close', () => {
      this.broadcast(webSocket, JSON.stringify({_ss_disconnect: clientId}));
    });

    return true;

  }

  private broadcast(sender: WebSocket, message: any) {
    this.clients
      .filter((ws: WebSocket) => ws != sender && ws.readyState == ws.OPEN)
      .forEach((ws: WebSocket) => {
        ws.send(message);
      });
  }

}
