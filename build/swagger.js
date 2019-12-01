// @ts-check
const swts = require("@proerd/swagger-ts-template")
const fs = require("fs")
const path = require("path")

async function run() {
  const str = fs.readFileSync(__dirname + "/spotify-oai.json", "utf8")
  const json = JSON.parse(str)
  await swts.genPaths(json, {
    output: path.resolve(__dirname, "..", "components/_oai"),
    moduleStyle: "esm"
  })
  console.log("done")
}

run()
