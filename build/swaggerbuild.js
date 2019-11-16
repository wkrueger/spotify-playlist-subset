// @ts-check
const swts = require('@proerd/swagger-ts-template');
const fs = require('fs');
const path = require('path');
const lo = require('lodash');

async function run() {
  const str = fs.readFileSync(__dirname + '/swagger.json', 'utf8');
  const json = JSON.parse(str);
  // const foundOids = new Set();
  await swts.genPaths(json, {
    output: path.resolve(__dirname, '..', 'src/api/oai'),
    moduleStyle: 'esm',
  });
  console.log('done');
}

run();
