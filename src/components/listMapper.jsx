const RenderAlbum =({album}) =>{
  return(<p>{album.albumName} by {album.artistName}: {album.plays} plays</p>)
}
const RenderArtist =({ar}) =>{
  return(<p>{ar.artistName}: {ar.plays} plays</p>)
}
const RenderSong =({so}) =>{
  if(so.songName!==null){
return(<p>{so.songName} by {so.artistName}: {so.plays} plays</p>)
  }
  
}
export default {RenderAlbum,RenderArtist,RenderSong}