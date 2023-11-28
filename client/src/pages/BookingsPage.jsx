import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PlaceImg from "../PlaceImg";
import AccountNav from "./AccountNav";
import { differenceInCalendarDays, formatDistance } from "date-fns";
import { format } from "date-fns/esm";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("https://airbnb-9av7.onrender.com/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);
  const { id } = useParams();
  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link
            to={`/account/bookings/${booking._id}`}
              key={booking}
              className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden"
            >
              <div className="w-48">
                <PlaceImg place={booking.place} />
              </div>
              <div className="py-3 grow pr-3">
                <h2 className="text-xl">{booking.place.title}</h2>
                <div className="border-t border-gray-300 mt-2 py-2 text-sm text-gray-500">
                  {format(new Date(booking.checkIn), "yyy-MM-dd")} &rarr;{" "}
                  {format(new Date(booking.checkOut), "yyy-MM-dd")}
                </div>
              <div className="text-xl">
                {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} nights
                | Total Price: ${booking.price}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default BookingsPage;
