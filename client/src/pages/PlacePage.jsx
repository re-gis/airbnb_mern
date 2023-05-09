import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return "";

  return (
    <div className="mt-8 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>

      <PlaceGallery place={place} />

      <div className="grid mt-8 gap-9 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          Check-in: {place.checkIn} <br />
          Check-out: {place.checkOut} <br />
          Max of number of guests: {place.maxGuests}
        </div>
        <div className="md:mt-4">
          <BookingWidget place={place} />
        </div>

        <div className="bg-white -mx-8 px-8 py-8 border-t">
          <div>
            <h2 className="font-semibold text-2xl">Extra Information</h2>
          </div>
          <div className="mb-2 mt-2 text-sm text-gray-700 leading-5">
            {place.extraInfo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
