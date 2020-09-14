const Logger = {
  _queue: [],
  put(event) {
    this._queue.push(event);
  },
  sendToServer() {
    if (this._queue.length === 0) return;
    let toSend = this._queue.slice();
    this._queue = [];
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(toSend),
    };
    fetch('https://l.richland.im/', requestOptions)
        .then(response => response.json());
  },
};

setInterval(() => {
  Logger.sendToServer();
}, 15000);

export default Logger;
