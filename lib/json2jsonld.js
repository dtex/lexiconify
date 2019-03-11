'use strict';

const fs = require("fs");

module.exports = function (lex) {
  
  const ldFile = "docs/" + lex[0] + ".jsonld";
  
  let termset = lex[1].filter(function(thing) {
    if (!thing["@type"]) return false;
    if (thing["@type"] === "DefinedTermSet") return true;
    if (thing["@type"].includes("DefinedTermSet")) return true;
    return false;
  });

  fs.writeFileSync(ldFile, JSON.stringify(lex[1]));
  
};