const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://aryanbansal667:Aryanbansal@cluster0.dkuxkab.mongodb.net/E-commerce");

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });

app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `https://e-commerce-app-backend-73bp.onrender.com/images/${req.file.filename}`,
  });
});

const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

app.post('/addproduct', async (req, res) => {
  let products = await Product.find({});
  let id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1;

  const product = new Product({
    id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  res.json({ success: true, name: req.body.name });
});

app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
});

app.get('/allproducts', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  sizeData: { type: Object },
  date: { type: Date, default: Date.now },
});

app.post('/signup', async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, errors: "existing user found with same email address" });
  }

  let cart = {};
  let sizes = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
    sizes[i] = "";
  }

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
    sizeData: sizes,
  });

  await user.save();

  const data = { user: { id: user.id } };
  const token = jwt.sign(data, 'secret_ecom');
  res.json({ success: true, token });
});

app.post('/login', async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (user && req.body.password === user.password) {
    const data = { user: { id: user.id } };
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
  } else {
    res.json({ success: false, error: user ? "Wrong Password" : "Wrong Email Id" });
  }
});

app.get('/newcollections', async (req, res) => {
  const products = await Product.find({});
  const newcollection = products.slice(1).slice(-8);
  res.send(newcollection);
});

app.get('/popularinwomen', async (req, res) => {
  const products = await Product.find({ category: "women" });
  const popular_in_women = products.slice(0, 4);
  res.send(popular_in_women);
});

const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send({ errors: "Please authenticate using valid token" });

  try {
    const data = jwt.verify(token, 'secret_ecom');
    req.user = data.user;
    next();
  } catch {
    res.status(401).send({ errors: "please authenticate a valid token" });
  }
};

app.post('/addtocart', fetchUser, async (req, res) => {
  const { itemId, size } = req.body;
  const user = await Users.findOne({ _id: req.user.id });

  if (!user.cartData) user.cartData = {};
  if (!user.sizeData) user.sizeData = {};

  user.cartData[itemId] = (user.cartData[itemId] || 0) + 1;
  user.sizeData[itemId] = size || "";

  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: user.cartData, sizeData: user.sizeData }
  );

  res.send("Added");
});

app.post('/removefromcart', fetchUser, async (req, res) => {
  const { itemId } = req.body;
  const user = await Users.findOne({ _id: req.user.id });

  if (!user.cartData || !user.cartData[itemId]) {
    return res.status(400).json({ message: "Item not in cart" });
  }

  if (user.cartData[itemId] > 1) {
    user.cartData[itemId] -= 1;
  } else {
    delete user.cartData[itemId];
    delete user.sizeData[itemId];
  }

  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: user.cartData, sizeData: user.sizeData }
  );

  res.json({ message: "Removed" });
});

app.post('/getcart', fetchUser, async (req, res) => {
  const user = await Users.findOne({ _id: req.user.id });
  const cartData = user.cartData || {};
  const sizeData = user.sizeData || {};
  res.json({ cartData, sizeData });
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error :" + error);
  }
});
