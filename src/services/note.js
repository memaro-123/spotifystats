import axios from 'axios'
const getArtists = () => {
  return axios.get("http://localhost:3001/topArtists")
}
const getSongs= () => {
  return axios.get("http://localhost:3001/topSongs")
}

const getAlbums= () => {
  return axios.get("http://localhost:3001/topAlbums")
}
const updateYear =(year) =>{
  console.log ("updating year")
  return axios.post("http://localhost:3001/processYear", { year: year })
  .then(response => {
      console.log("response from server:", response.data); 
      return response.data.updatedData
    })
}
function submitFormData(files) {
  const formData = new FormData()
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }
  return axios.post("http://localhost:3001/upload_files", formData)
  .then((res)=>{
    console.log('Data only:', res.data)
  })
  .catch((err) => {
      console.error("Error occurred:", err);
      throw err; // rethrow so the caller can handle it
    })
}

export default { 
  getArtists: getArtists,
  getSongs: getSongs ,
  getAlbums:getAlbums,
  updateYear:updateYear,
  submitFormData:submitFormData
}