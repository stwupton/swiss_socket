# Swiss Socket
Node, WebSocket server made in TypeScript.

## Install

    $ npm install -g swiss_socket

## Usage

Without any flags `ss` will bind to '0.0.0.0' and will automatically be assigned a port by the OS.

    $ ss

The alternative command `ssock` is available if the `ss` command already exists and is in your PATH.

## Flags

You can pass four flags to specify host, port, maximum connection pools and maximum sockets per pool.

`--port`

Default: 0.

The port to bind the server to.

`--host`

Default: '0.0.0.0'

The host to bind the server to.

`--max-pools`

Default: 10.

The maximum amount of connection pools that can be running simultaneously.

`--max-sockets`

Default: 20.

The maximum amount of WebSockets that can connected to each pool.

**Example:**

    $ ss --port 8080 --max-pools 1 --max-sockets 5 
