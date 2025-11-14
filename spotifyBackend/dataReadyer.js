const fs = require("fs")
const path = require("path")
const AdmZip = require("adm-zip")
try{
const uploadsFolder = './uploads'

const zipFile = process.argv[2] // "uploads/extendedstreaming.zip"
const outputFolder = path.join(path.dirname(zipFile), "unzipped")

const zip = new AdmZip(zipFile)
zip.extractAllTo(outputFolder, true)

// Look for the actual extracted folder (it might have a name like "Spotify Extended Streaming History")
const extractedContents = fs.readdirSync(outputFolder);
const actualDataFolder = path.join(
  outputFolder,
  extractedContents.find(item =>
    fs.statSync(path.join(outputFolder, item)).isDirectory()
  )
)

let combinedArray = []

// Read from the actual data folder, not the root unzipped folder
fs.readdirSync(actualDataFolder).forEach((file) => {
  if (file.endsWith(".json")) {
    const jsonPath = path.join(actualDataFolder, file);
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    if (Array.isArray(data)) combinedArray.push(...data);
  }
})
const combinedPath = path.join(__dirname, "combined.json")
fs.writeFileSync(combinedPath, JSON.stringify(combinedArray, null, 2))

console.log("Combined JSON saved to", combinedPath);
}
catch (err){
  process.exit(1)
}