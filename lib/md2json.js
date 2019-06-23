'use strict';

const fs = require("fs");
const path = require('path');

module.exports = function (mdFile, src) {
  
  const jsFile = mdFile.replace("md", "jsonld");
  let md = fs.readFileSync(path.join(src, mdFile), { encoding: "utf8" });
  let terms = md.replace(/\n/g, "").split(/(?=<dt)/);
  let termset = terms.shift();
  let rootURL = /.*url="(.*)".*$/.exec(termset)[1];

  let result = [
    { "@context": "http://schema.org/" },
    {
      "@type": ["DefinedTermSet","Consortium","Project"],
      "@id": rootURL,
      "name": /<dl.*>(.*$)/.exec(termset)[1]
    }
  ];
  
  terms.forEach(function(term) {
    let parsedTerm = /<dt[^>]*>(.*)<dd>(.*)/.exec(term);
    
    if (parsedTerm[1].indexOf("href") !== -1) {
      parsedTerm[1] = /<a[^>]*>(.*)</.exec(parsedTerm[1])[1];
    }
    
    let termObj = {
      "@type": "DefinedTerm",
      "@id": rootURL + "#" + parsedTerm[1],
      "name": parsedTerm[1],
      "description": parsedTerm[2],
      "inDefinedTermSet": rootURL + "/" + jsFile
    };
    
    let url =/<a.*href="(.*)"/.exec(term);
    
    if (url && url[1]) {
      termObj.url = url[1];
    }
    result.push(termObj);
  });

  return result;

}