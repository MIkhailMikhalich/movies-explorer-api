class DoNotHavePermission extends Error {
  constructor(mes) {
    super(mes);
    this.statusCode = 403;
  }
}

module.exports = DoNotHavePermission;
