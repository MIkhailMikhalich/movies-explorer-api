class NotFound extends Error {
  constructor(mes) {
    super(mes);
    this.statusCode = 404;
  }
}
module.exports = NotFound;
