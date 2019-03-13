#!/usr/bin/env node
// 👆 Used to tell Node.js that this is a CLI tool

const fs = require("fs");
const path = require('path');

const md2json = require("./md2json.js");
const json2jsonld = require("./json2jsonld.js");
const json2html = require("./json2html.js");

const src = process.argv[2] || "./src";
const dest = process.argv[3] || "./docs";
const template = process.argv[4] || "./template/lexicon.mustache";

let files;

if (fs.lstatSync(src).isDirectory()) {
  files = fs.readdirSync(src);
} else {
  files = [path.basename(src)];
  src = path.dirname(src);
}

/* Convert markdown to JSON */
const lexica = {};

files.forEach(function (file) {
  let name = file.replace(".md", "").substring(file.lastIndexOf("/") + 1);
  lexica[name] = md2json(file, src, dest);
});

/* Convert JSON to jsonld files */
Object.entries(lexica).forEach(function(entry) {
  json2jsonld(entry, dest);
});

/* Convert JSON to HTML file */
json2html(lexica, dest, template);
console.log("HTML and JSONLD files updated\n");