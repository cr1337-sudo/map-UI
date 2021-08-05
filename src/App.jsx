import "./app.css";
import Register from "./components/Register";
import Login from "./components/Login";
import { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
//Pdocution fix
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
////////
import { useEffect } from "react";
import { format } from "timeago.js";
import axios from "axios";

function App() {
  //Local storage
  const myStorage = window.localStorage;
  //Use states
  const [currentUser, setCurrentUser] = useState(
    myStorage.getItem("user") || null
  );
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 48.85,
    longitude: 2.2946,
    zoom: 8,
  });
  const [newPlace, setNewPlace] = useState(null);
  const [newPin, setNewPin] = useState({
    username: "",
    title: "",
    desc: "",
    rating: "",
    lat: "",
    long: "",
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  //use Effect
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await fetch("https://map-api-cr1337.herokuapp.com/api/pins");
        const data = await res.json();
        setPins(data);
      } catch (e) {
        console.log("Error");
      }
    };
    getPins();
  }, []);

  //Handlers
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({
      ...viewport,
      latitude: lat,
      longitude: long,
    });
  };

  const handleAddClick = (e) => {
    if (currentUser) {
      const [long, lat] = e.lngLat;
      setNewPlace({
        lat,
        long,
      });
    }
  };

  const handleNewPin = (e) => {
    setNewPin({
      ...newPin,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNewPin({
      ...newPin,
      username: currentUser,
      lat: newPlace.lat,
      long: newPlace.long,
    });

    try {
      const res = await axios.post("https://map-api-cr1337.herokuapp.com/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch {
      console.log("error");
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/cr1337/ckrr4awdf4ajz17pdvy6f9aae"
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div>
                <Room
                  style={{
                    fontSize: viewport.zoom * 10,
                    color: p.username === currentUser ? "tomato" : "blue",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                />
              </div>
            </Marker>
            {p._id === currentPlaceId ? (
              <Popup
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="top"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            ) : null}
          </>
        ))}
        {newPlace ? (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form action="" onSubmit={handleSubmit}>
                <label htmlFor="">Title</label>
                <input
                  type="text"
                  placeholder="Enter a title"
                  name="title"
                  onChange={handleNewPin}
                />
                <label htmlFor="">Review</label>
                <textarea
                  name="desc"
                  id=""
                  rows="3"
                  placeholder="Tell us something about this place"
                  onChange={handleNewPin}
                ></textarea>
                <label htmlFor="">Rating</label>
                <select name="rating" id="" onChange={handleNewPin}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Send
                </button>
              </form>
            </div>
          </Popup>
        ) : null}
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button
              className="button login"
              onClick={() => {
                setShowLogin(true);
                setShowRegister(false);
              }}
            >
              Login
            </button>
            <button
              className="button register"
              onClick={() => {
                setShowRegister(true);
                setShowLogin(false);
              }}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
