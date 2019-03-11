#!/usr/bin/env node
// 👆 Used to tell Node.js that this is a CLI tool

const fs = require("fs");
const md2json = require("./md2json.js");
const json2jsonld = require("./json2jsonld.js");
const json2html = require("./json2html.js");

const files = fs.readdirSync("./src");

/* Convert markdown to JSON */
const lexica = {};

files.forEach(function (file) {
  let name = file.replace(".md", "");
  lexica[name] = md2json("./src/" + file);
});

/* Convert JSON to jsonld files */
Object.entries(lexica).forEach(function(entry) {
  json2jsonld(entry);
});

/* Convert JSON to HTML file */
json2html(lexica);
console.log("HTML and JSONLD files updated\n");