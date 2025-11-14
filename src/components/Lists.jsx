import Comps from './Note'
const Lists = ({ sayYear, first10Ar, first10Al, first10So }) =>{
    return(<>
        <h3>Top 10 Artists of {sayYear}!</h3>
      {first10Ar.map(ar => (
      <Comps.RenderArtist ar={ar} key = {ar.artistName}/>
      ))}

      <h3>Top 10 Albums of {sayYear}!</h3>
      {first10Al.map(al => (
        <Comps.RenderAlbum album={al} key = {al.albumName} />
      )
      
      )}
      <h3>Top 10 Songs of {sayYear}!</h3>
      {first10So.map(so => (
      <Comps.RenderSong so={so} key = {so.songName}/>
      ))}
        </>
    )
}
export default Lists