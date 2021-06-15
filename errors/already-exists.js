class AlreadyExsists extends Error {
  constructor(mes) {
    super(mes);
    this.statusCode = 409;
  }
}
module.exports = AlreadyExsists;
