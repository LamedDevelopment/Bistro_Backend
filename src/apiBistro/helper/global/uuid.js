const { v4: uuidv4 } = require('uuid');

async function uuiConsecutivo() {
  const id = uuidv4();
  return id;
}

module.exports = {
    uuiConsecutivo,
}