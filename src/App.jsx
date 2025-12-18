import musicService from "./services/note";
import Lists from "./components/Lists.jsx";
import YearSearch from "./components/yearSearch.jsx";
import FileUpload from "./components/fileUpload.jsx";
import { useState, useEffect } from "react";
import { useRef } from "react";
import "./styles.css";
import logoImage from "./assets/logo.jpg";
const App = () => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [year, setYear] = useState("");
  const [sayYear, setSayYear] = useState("2025");
  const [dataStatus, setDataStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redErrorText, setErrorText] = useState(false);
  const fileInputRef = useRef();
  useEffect(() => {
    musicService.getAlbums().then((response) => {
      setAlbums(response.data);
    });
    musicService.getArtists().then((response) => {
      setArtists(response.data);
    });
    musicService.getSongs().then((response) => {
      setSongs(response.data);
    });
  }, [loading]);
  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setYear(newYear);
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const files = fileInputRef.current.files; //kind of like current event
    musicService
      .submitFormData(files)
      .then((data) => {
        console.log("upload successful");
        setErrorText(false);
        setDataStatus(true);
      })
      .catch((err) => {
        setErrorText(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleYearClick = (event) => {
    event.preventDefault();
    if (
      !(
        Number.isFinite(Number(year)) &&
        Number(year) >= 2006 &&
        Number(year) <= 2025
      ) &&
      year !== "all" &&
      year !== "All"
    ) {
      alert("NOT A REAL YEAR DUMBASS");
    } else {
      setLoading(true);
      musicService.updateYear(year).then((updatedData) => {
        console.log(updatedData.topArtists);
        setArtists([...updatedData.topArtists]);
        setSongs([...updatedData.topSongs]);
        setAlbums([...updatedData.topAlbums]);
        let newYear = year;
        if (newYear === "all" || newYear === "All") {
          newYear = "All Time";
        }
        setSayYear(newYear);
        setYear("");
      });

      setLoading(false);
    }
  };

  const first10Al = albums.slice(0, 10);
  const first10So = songs.slice(0, 10);
  const first10Ar = artists.slice(0, 10);

  return (
    <div>
      <header className="top-banner">
        <div className="logo">
          <i className="fab fa-spotify"></i>
          <img
            src={logoImage}
            alt="Logo"
            style={{
              height: "30px",
              borderRadius: "4px",
            }}
          />
          <span>SpotifyStats</span>
        </div>
      </header>

      {loading ? <p>loading...</p> : null}
      
      {dataStatus ? (<YearSearch
          year={year} onYearChange={handleYearChange} onYearClick={handleYearClick}/>) : null}
          {dataStatus ? null:(<FileUpload
        redErrorText={redErrorText}
        handleFormSubmit={handleFormSubmit}
        fileInputRef={fileInputRef}
      />)}
      
      {dataStatus ? (
        <Lists
          sayYear={sayYear}
          first10Ar={first10Ar}
          first10Al={first10Al}
          first10So={first10So}
        />
      ) : null}
    </div>
  );
};

export default App;
