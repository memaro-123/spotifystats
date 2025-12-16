const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

let stats
const  uploadFiles =(req, res) => {
  console.log(req.body)
  console.log(req.files)
  if (!req.files || req.files.length === 0) {
  return res.status(400).json({ error: "No files uploaded" });
}
  const uploadedFile = req.files[0]
  const filePath = uploadedFile.path
  exec(`node dataReadyer.js ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Processing failed" })
    }
    console.log("Processing completed:", stdout)
    exec(`node process.js`, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return res.status(500).json({ error: "Processing failed" });
      }
      const updatedStats = JSON.parse(fs.readFileSync("stats.json"))

      res.json({ success: true, updatedData: updatedStats })
      stats = JSON.parse(fs.readFileSync("stats.json"))
      console.log("done processing")
    })
  })
}
const clearUploadsFolder = (req, res, next)=> {
  const dir = path.join(__dirname, "uploads")

  if (fs.existsSync(dir)) {
  fs.rmSync(dir, { recursive: true, force: true })
}
  fs.rmSync(path.join(__dirname, "stats.json"), { force: true })
  fs.mkdirSync(dir)


  next()
}
module.exports={uploadFiles,clearUploadsFolder}