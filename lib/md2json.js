'use strict';

const fs = require("fs");

const rootURL = "https://EcmaTC53.github.io/lexicon";

module.exports = function (mdFile) {
  
  const jsFile = mdFile.replace("md", "jsonld");
  let md = fs.readFileSync(mdFile, { encoding: "utf8" });
  let terms = md.split("\n");
    
  let result = [
    { "@context": "http://schema.org/" },
    {
      "@type": ["DefinedTermSet","Consortium","Project"],
      "@id": rootURL,
      "name": terms.shift().substring(terms[0].indexOf("<dl>") + 5)
    }
  ];

  terms.forEach(function(term) {
    let dt = term.substring(term.indexOf("<dt>") + 4, term.indexOf("<dd>"));
    let dd = term.substring(term.indexOf("<dd>") + 4);
    result.push({
      "@type": "DefinedTerm",
      "@id": rootURL + "#" + dt,
      "name": dt,
      "description": dd,
      "inDefinedTermSet": rootURL + "/" + jsFile
    });  
  });

  return result;

}