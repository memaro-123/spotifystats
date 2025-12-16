const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const { uploadFiles, clearUploadsFolder } = require("./fileHelpers");

let stats;
try {
  stats = JSON.parse(fs.readFileSync("stats.json"));
} catch (err) {
  stats = { topAlbums: [], topSongs: [], topArtists: [] };
}

router.post("/processYear", (req, res) => {
  const { year } = req.body;

  



  // Run process.js as a child
  exec(`node process.js ${year}`, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: "Processing failed" });
    }
    stats = JSON.parse(fs.readFileSync("stats.json"));

    res.json({ success: true, updatedData: stats })
    console.log("done processing")
  })
})
router.post("/upload_files", clearUploadsFolder, upload.array("files"), uploadFiles)
router.get('/topAlbums', (request, response) => {
  response.json(stats.topAlbums)
})
router.get('/', (request, response) => {
  console.log("hello world")
})
router.get('/topSongs', (request, response) => {
  response.json(stats.topSongs)
})
router.get('/topArtists', (request, response) => {
  response.json(stats.topArtists)
})
module.exports = router;