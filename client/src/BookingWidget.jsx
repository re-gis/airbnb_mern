import React from "react";
import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";

const BookingWidget = ({ place }) => {
  const [max, setMax] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [redirect, setRedirect] = useState("");

  let numberOfDays = 0;

  if (checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  const bookThisPlace = async () => {
    const data = {
      checkIn,
      checkOut,
      max,
      name,
      mobile,
      place: place._id,
      price: numberOfDays * place.price,
    };
    const response = await axios.post("/bookings", data);

    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <>
      <div className="bg-white shadow p-4 rounded-2xl">
        <div className="text-2xl text-center truncate">
          Price: ${place.price} /Night
        </div>

        <div className="border rounded-2xl mt-4">
          <div className="md:flex">
            <div className="py-3 px-4">
              <label>Check In: </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="py-3 px-4 border-t md:border-l">
              <label>Check Out: </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="py-3 px-4 border-t md:border-l">
              <label>Number of guests: </label>
              <input
                className="outline-none"
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
              />
            </div>

            {numberOfDays > 0 && (
              <div className="py-3 px-4 border-t md:border-l">
                <label>Your Full Name: </label>
                <input
                  className="outline-none"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label>Your Mobile: </label>
                <input
                  className="outline-none"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        <button onClick={bookThisPlace} className="primary mt-4">
          Book This
          {numberOfDays > 0 && <span>{" $" + numberOfDays * place.price}</span>}
        </button>
      </div>
    </>
  );
};

export default BookingWidget;
