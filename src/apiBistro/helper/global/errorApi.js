class DAOError extends Error {
  constructor(message, method) {
    super(message);
    this.method = method;
  }
}

module.exports = {
    DAOError,
};