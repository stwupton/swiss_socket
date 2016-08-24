import {SocketServer} from '../lib/swiss_socket';

let host: string;
let port: number;

let flags: string[] = process.argv.filter(
    (arg: string) => arg.substring(0, 2) == '--');

// Get value of valid flags.
for (let flag of flags) {
  switch (flag) {

    case '--port':
      port = parseInt(flagValue(flag));
      break;
    case '--host':
      host = flagValue(flag);
      break;

  }
}

let socket: SocketServer = new SocketServer(host, port);
socket.start();

function flagValue(flag: string) {
  let i = process.argv.indexOf(flag);
  return process.argv[++i];
}
