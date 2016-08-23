import {SwissSocket} from '../lib/swiss_socket';

let socket: SwissSocket = new SwissSocket('0.0.0.0', 8080);
socket.start();
