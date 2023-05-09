import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "./AccountNav";

const PlacesFormPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAdress] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100)
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const savePlace = async (e) => {
    e.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    };

    if (id) {
      // This is updating a place
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      // This is saving new place

      await axios.post("/places", {
        ...placeData,
      });
      setRedirect(true);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios.get("/places/" + id).then((response) => {
        const { data } = response;
        setTitle(data.title);
        setAdress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price)
      });
    }
  }, [id]);

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <>
      <div>
        <AccountNav />
        <form onSubmit={savePlace}>
          <h2 className="text-2xl mt-4">Title</h2>
          <p className="text-gray-500 text-sm">Short title for your place</p>
          <input
            className="outline-0"
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <h2 className="text-2xl mt-4">Address</h2>
          <p className="text-gray-500 text-sm">Address to this place</p>
          <input
            className="outline-0"
            type="text"
            placeholder="Address..."
            value={address}
            onChange={(e) => setAdress(e.target.value)}
          />

          <h2 className="text-2xl mt-4">Photos...</h2>
          <p className="text-gray-500 text-sm">More = Better</p>
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

          <h2 className="text-2xl mt-4">Description...</h2>
          <p className="text-gray-500 text-sm">Description</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="outline-none"
          />

          <h2 className="text-2xl mt-4">Perks...</h2>
          <p className="text-gray-500 text-sm">Select The perks of the place</p>

          <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <Perks selected={perks} onChange={setPerks} />
          </div>

          <h2 className="text-2xl mt-4">Extra Info...</h2>
          <p className="text-gray-500 text-sm">Extra Information</p>
          <textarea
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
            className="outline-none"
          />

          <h2 className="text-2xl mt-4">Check In& Out</h2>
          <p className="text-gray-500 text-sm">Add check in and out times, </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <h3 className="mt-2 -mb-1">Check in time</h3>
              <input
                className="outline-none"
                type="text"
                placeholder="14:00"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div>
              {" "}
              <h3 className="mt-2 -mb-1">Check out time</h3>
              <input
                className="outline-none"
                type="text"
                placeholder="11:00"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
            <div>
              {" "}
              <h3 className="mt-2 -mb-1">Max Guests</h3>
              <input
                className="outline-none"
                type="number"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
              />
            </div>
            
            
            <div>
              {" "}
              <h3 className="mt-2 -mb-1">Price Per Night</h3>
              <input
                className="outline-none"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button className="primary my-4">Save</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PlacesFormPage;
