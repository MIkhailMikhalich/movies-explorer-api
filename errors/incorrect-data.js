class IncorrectData extends Error {
  constructor(mes) {
    super(mes);
    this.statusCode = 400;
  }
}
module.exports = IncorrectData;
