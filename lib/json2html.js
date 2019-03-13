'use strict';

const fs = require("fs");
const path = require('path');
const mustache = require("mustache");
  
module.exports = function (lexica, dest, tmplt) {

  let template = fs.readFileSync(tmplt, "utf8");
  
  let view = {
    lexica: []
  };
  
  // Make the jsonld mustache friendly
  Object.entries(lexica).forEach(function(lexicon) {
    view.lexica.push({
      termset: getTermset(lexicon[1]),
      terms: getTerms(lexicon[1])
    });
  });

  const output = mustache.render(template, view);
  fs.writeFileSync(path.join(dest, "index.html"), output);
};

function getTermset(lexicon) {
  let result = lexicon.filter(function(thing) {
    if (!thing["@type"]) return false;
    return thing["@type"].includes("DefinedTermSet");
  });
  result[0]["@type"] = result[0]["@type"].join(" ");
  return result;
}

function getTerms(lexicon) {
  return lexicon.filter(function(thing) {
    return thing["@type"] === "DefinedTerm";
  }).sort(function(a, b) {
    return a.name > b.name ? 1 : -1;
  })
}