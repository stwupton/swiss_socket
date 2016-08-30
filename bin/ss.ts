import {SocketServer} from '../lib/swiss_socket';

let host: string;
let port: number;
let maxPools: number;
let maxSockets: number;

let flags: string[] = process.argv.filter(
    (arg: string) => arg.substring(0, 2) == '--');

// Get value of valid flags.
for (let flag of flags) {
  switch (flag) {

    case '--host':
      host = flagValue(flag);
      break;
    case '--port':
      port = parseInt(flagValue(flag));
      break;
    case '--max-pools':
      maxPools = parseInt(flagValue(flag));
      break;
    case '--max-sockets':
      maxSockets = parseInt(flagValue(flag));
      break;

  }
}

let socket: SocketServer = new SocketServer(host, port, maxPools, maxSockets);
socket.start();

function flagValue(flag: string) {
  let i = process.argv.indexOf(flag);
  return process.argv[++i];
}
