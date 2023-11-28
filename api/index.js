const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const Joi = require("joi");
const User = require("./models/user.model");
const Place = require("./models/place.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Booking = require("./models/booking.model");

const getUserDataFromToken = (req) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET,
      {},
      async (error, data) => {
        if (error) throw error;
        resolve(data);
      }
    );
  });
};

const object = Joi.object({
  name: Joi.string().min(5).max(100).required(),
  email: Joi.string().min(3).max(100).email().required(),
  password: Joi.string().min(5).max(100).required(),
});

app.use(cookieParser());

app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5174",
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected!"))
  .catch((e) => console.log(e));

app.use(express.json());

// Registering a user

app.post("/register", async (req, res) => {
  try {
    const { error } = object.validate(req.body);
    if (error) {
      return res.json({
        error: error.details[0].message,
      });
    } else {
      const { name, email, password } = req.body;
      // Hash password
      const hashedPass = await bcrypt.hash(password, 10);

      // Register a user
      const newUser = await User.create({
        name,
        email,
        password: hashedPass,
      });

      res.json(newUser);
    }
  } catch (err) {
    res.json(err);
  }
});

// Login a user

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      message: "All credentials are required...",
    });
  }
  // Check if the user exists

  const userExists = await User.findOne({ email });
  if (userExists && (await bcrypt.compare(password, userExists.password))) {
    // Check if passwords match
    jwt.sign(
      { email: userExists.email, id: userExists._id },
      process.env.JWT_SECRET,
      {},
      (error, token) => {
        if (error) throw error;
        return res.cookie("token", token).json(userExists);
      }
    );
  } else {
    return res.json({
      message: "Invalid password or email...",
    });
  }
});

// Get profile
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (error, user) => {
      if (error) throw error;
      const { name, email, _id } = await User.findById(user.id);
      return res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

// Logout
app.post("/logout", (req, res) => {
  return res.cookie("token", "").json(true);
});

// Upload photos by link
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({
  dest: "uploads",
});

// Upload photo
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

// Post
app.post("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (error, user) => {
    if (error) throw error;
    const placeDoc = await Place.create({
      owner: user.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
    if (error) throw error;
    const { id } = userData;
    // const places = )
    res.json(await Place.find({ owner: id }));
  });
});

// Get a place
app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  return res.json(place);
});

// Update a place

app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
    if (error) throw error;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("OK");
    }
  });
});

// Get places for the index page
app.get("/places", async (req, res) => {
  const places = await Place.find();
  return res.json(places);
});

// Booking api
app.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromToken(req);
  const { place, checkIn, checkOut, nummberOfGuests, name, mobile, price } =
    req.body;
  const booking = await Booking.create({
    place,
    user: userData.id,
    checkIn,
    checkOut,
    nummberOfGuests,
    name,
    mobile,
    price,
  });

  if (booking) {
    res.json(booking);
  } else {
    res.json({ msg: "Error occurred..." });
  }
});

// Get the bookings
app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromToken(req);
  const bookings = await Booking.find({ user: userData.id }).populate("place");
  res.json(bookings);
});

app.listen(4000, () => {
  console.log("Server listening port 4000...");
});
