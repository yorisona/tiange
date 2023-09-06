const { EventEmitter } = require('events')
const { WebSocketServer } = require('ws');

// 第一个字节 数据类型
// 第二个字节 表示路由名称
// 3-6 字节 表示响应ID
// 数据体


module.exports.GenerateSocket = class GenerateSocket {

  generate;

  constructor(generate) {
    this.upgrade = this.upgrade.bind(this)
    this.onConnection = this.onConnection.bind(this)
    this.event = this.event.bind(this)
    this.call = this.call.bind(this)
    this.broadcast = this.broadcast.bind(this)
    this.wsServer = new WebSocketServer({ noServer: true })
    this.initWsServer();
    this.generate = generate;
    this._events = new Map()
    this._clientSockets = new Set();
  }

  on(event, fn) {
    let listener = this._events.get(event);
    if (listener === undefined) {
      listener = [fn];
      this._events.set(event, listener)
    } else {
      listener.push(fn)
    }
  }

  event(name, fn) {
    return this.on(name, fn)
  }

  call(name, fn) {
    return this.on(name, fn)
  }

  /** 广播数据 **/
  broadcast(event, data) {
    const resultMessage = JSON.stringify({
      type: 'event', event, data
    })
    for (let ws of this._clientSockets) {
      try {
        ws.send(resultMessage)
      } catch (ex) {
      }
    }
  }


  async todo(event, params = []) {
    let result = {};
    try {
      const listener = this._events.get(event);
      if (listener === undefined) throw new Error('找不到对应的方法')
      const method = listener[0];
      if (method === undefined) throw new Error('找不到对应的方法')

      result.data = await method(...params)
      result.success = true;

    } catch (ex) {
      result.success = false;
      result.message = ex.message
      console.error('执行出错了:\n-----------------------------------\n', ex.message)
    }
    return result;
  }

  async onConnection(ws) {
    this._clientSockets.add(ws)
    ws.on('close', () => {
      this._clientSockets.delete(ws)
    })
    ws.on('message', this.onClientMessage.bind(this, ws));

    const { data, success } = await this.todo('join')
    if (!success) return;
    const resultMessage = {
      type: 'event', event: 'join', data
    }
    ws.send(JSON.stringify(resultMessage))
  }

  async onClientMessage(ws, buffer) {
    const message = JSON.parse(buffer.toString());
    const { type, call, params = [], id } = message;
    const result = await this.todo(call, params);


    const resultMessage = {
      type: 'result', id, data: result.data, success: result.success, message: result.message
    }

    ws.send(JSON.stringify(resultMessage))

  }

  initWsServer() {
    this.wsServer.on('connection', this.onConnection);


  }

  upgrade(request, socket, head) {
    if (request.url === '/plugins/generate/socket') {
      this.wsServer.handleUpgrade(request, socket, head, (ws) => {
        this.wsServer.emit('connection', ws, request)
      })
    }
  }


  apply(config) {
    config(this)
  }


}