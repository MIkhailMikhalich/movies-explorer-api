class IncorrectAuthData extends Error {
  constructor(mes) {
    super(mes);
    this.statusCode = 401;
  }
}

module.exports = IncorrectAuthData;
