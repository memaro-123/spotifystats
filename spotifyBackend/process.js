const fs = require("fs");
const StreamArray = require("stream-json/streamers/StreamArray")
const year = process.argv[2]|| "2025"
console.log(`year updated {year}`)
const jsonStream = StreamArray.withParser();

fs.createReadStream("combined.json").pipe(jsonStream.input); //db or combinedfiles

// Stats variables
let totalListening= 0;
let artists = [];
let albums = [];
let songs = [];

// Process each object
jsonStream.on("data", ( {value} ) => {
  let timeFrame=year
  if (timeFrame ==="all"||timeFrame ==="All"){
    timeFrame=""
  }
    if(value.ts.startsWith(timeFrame)){// year selector

  //for total global stats
  const msPlayed = value.ms_played 
  totalListening += msPlayed;

  //for artist stats
  const artistObj = artists.find(x => x.artistName === value.master_metadata_album_artist_name)
  if (artistObj) { //if they are already in the array
    artistObj.plays+=1
    artistObj.time+=value.ms_played
    if(value.skipped){
        artistObj.skipped+=1
        }
    artistObj.skipRatio=artistObj.skipped/artistObj.plays
  }
  else{
    const newArtist = {"plays":1,"time":value.ms_played,"skipped":0, artistName:value.master_metadata_album_artist_name, skipRatio:0}
    if (value.skipped){ newArtist.skipped+=1}
    artists.push(newArtist)
  }

//for song stats
const songObj = songs.find(x => x.songName === value.master_metadata_track_name)
if (songObj) { //if they are already in the array
    songObj.plays+=1
    songObj.time+=value.ms_played
    if(value.skipped){
        songObj.skipped+=1
        }
    songObj.skipRatio=songObj.skipped/songObj.plays
  }
  else{
    const newSong = {
        "plays":1,
        "time":value.ms_played,
        "skipped":0, 
        "artistName":value.master_metadata_album_artist_name, 
        "songName":value.master_metadata_track_name,
        "skipRatio":0
    }
    if (value.skipped){ newSong.skipped+=1}
    songs.push(newSong)
  }

  //album stats
  const albumObj =albums.find(x=>x.albumName ===value.master_metadata_album_album_name)
  if(albumObj){
    albumObj.plays+=1
    albumObj.time+=value.ms_played
  }
  else{
    const newAlbum = {
        "plays":1,
        "time":value.ms_played,
        "artistName":value.master_metadata_album_artist_name,
        "albumName":value.master_metadata_album_album_name
    }
    albums.push(newAlbum)
  }
}
})


jsonStream.on("end", () => {
    artists.sort((a, b) => b.plays - a.plays);
    songs.sort((a, b) => b.plays - a.plays);
    albums.sort((a, b) => b.time - a.time);
    const topArtists = artists.slice(0, 30);
    const topSongs = songs.slice(0, 30);
    const topAlbums = albums.slice(0, 30);
  
 
  const stats = {
    totalTime: totalListening,
    listOfArtists:artists,
    listOfSongs:songs,
    listOfAlbums:albums,
    topArtists:topArtists,
    topSongs:topSongs,
    topAlbums:topAlbums
  };

  // Save stats to a JSON file
  fs.writeFileSync("stats.json", JSON.stringify(stats, null, 2));
  console.log("Finished processing file. Stats saved to stats.json");
});
