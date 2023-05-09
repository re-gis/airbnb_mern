const mongoose = require('mongoose')
const BookingModel = mongoose.Schema

const bookingSchema = new BookingModel({
    place: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Place'
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    checkIn: {
        type: Date,
        required: true
    },

    checkOut: {
        type: Date,
        required: true
    },

    name: {
        type:String,
        required: true
    },
     
    mobile: {
        type: String,
        required: true
    },

    price: Number  
})


module.exports = mongoose.model('Booking', bookingSchema)