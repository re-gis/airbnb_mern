import axios from "axios";
import { differenceInCalendarDays } from "date-fns";
import { format } from "date-fns/esm";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import AccountNav from "./AccountNav";

const BookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }
  return (
    <div>
      <AccountNav />
      <div className="mt-8">
        <h1 className="text-3xl">{booking.place.title}</h1>
        <AddressLink>{booking.place.address}</AddressLink>
        <div className="bg-gray-200 p-4 mb-4 rounded-2xl">
          <h1 className="text-xl">Your Booking Info:</h1>
          <div className="border-t border-gray-300 mt-2 py-2 text-sm text-gray-500">
            {format(new Date(booking.checkIn), "yyy-MM-dd")} &rarr;{" "}
            {format(new Date(booking.checkOut), "yyy-MM-dd")}
          </div>
          <div className="text-xl">
            {differenceInCalendarDays(
              new Date(booking.checkOut),
              new Date(booking.checkIn)
            )}{" "}
            nights | Total Price: ${booking.place.price}
          </div>
          <div className="block bg-primary w-20 p-2 rounded-xl text-white text-center mt-2">
            <div className="text-sm">
              Total Price
              <div>${booking.place.price}</div>
            </div>
          </div>
        </div>
        <PlaceGallery place={booking.place} />
      </div>
    </div>
  );
};

export default BookingPage;
