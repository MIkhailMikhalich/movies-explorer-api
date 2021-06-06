const regExp = new RegExp(
  "(http|https)://[0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*(:(0-9)*)*(/?)([a-zA-Z0-9-.?,'/\\+&%$#_]*)?([a-zA-Z0-9-?,'/+&%$#_]+)",
);
module.exports = regExp;
