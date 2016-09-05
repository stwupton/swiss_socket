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

- `--port`
    - Default: 0.
    - The port to bind the server to.

- `--host`
    - Default: '0.0.0.0'
    - The host to bind the server to.

- `--max-pools`
    - Default: 10.
    - The maximum amount of connection pools that can be running simultaneously.

- `--max-sockets`
    - Default: 20.
    - The maximum amount of WebSockets that can connected to each pool.

**Example:**

    $ ss --port 8080 --max-pools 1 --max-sockets 5

## Client Usage

All data received by the server is the content-type of `application/json`.

The first time the client connects it receives an id. This id is just for this client, and is what other connected WebSockets will receive when you broadcast a message. Example:

    {"_ss_id": 0}

All messages from the server following that are messages from other connected WebSocket's. Example:

    {"_ss_id": 1, "message": {name: "Bill", text: "Hi Ben."}}

The value of `"_ss_id"` in this case is the id of the client broadcasting this message.

When a client disconnects, all currently open WebSockets receive:

    {"_ss_disconnect": 2}
