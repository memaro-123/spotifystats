const express = require("express");
const cors = require("cors");
const fs = require("fs")
const { exec } = require("child_process");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" })//destination of uploads
const path = require("path")

// Middleware
app.use(cors());
app.use(express.json())
let stats
  try {
  stats = JSON.parse(fs.readFileSync("stats.json"));
} catch (err) {
  stats = { topAlbums: [], topSongs: [], topArtists: [] };
}


function clearUploadsFolder(req, res, next) {
  const dir = path.join(__dirname, "uploads")

  if (fs.existsSync(dir)) {
  fs.rmSync(dir, { recursive: true, force: true })
}
  fs.rmSync(path.join(__dirname, "stats.json"), { force: true })
  fs.mkdirSync(dir)


  next()
}

app.post("/processYear", (req, res) => {
  const { year } = req.body;

  // Run process.js as a child
  exec(`node process.js ${year}`, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: "Processing failed" });
    }
    const updatedStats = JSON.parse(fs.readFileSync("stats.json"));

    res.json({ success: true, updatedData: updatedStats })
    console.log("done processing")
  })
})
function uploadFiles(req, res) {
  console.log(req.body)
  console.log(req.files)
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
app.post("/upload_files", clearUploadsFolder, upload.array("files"), uploadFiles)
app.get('/topAlbums', (request, response) => {
  response.json(stats.topAlbums)
})
app.get('/', (request, response) => {
  console.log("hello world")
})
app.get('/topSongs', (request, response) => {
  response.json(stats.topSongs)
})
app.get('/topArtists', (request, response) => {
  response.json(stats.topArtists)
})
app.listen(3001, () => console.log("Server running on port 3001"));