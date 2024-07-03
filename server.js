import express from "express";
import mongoose from "mongoose";
import { User } from "./Models/User.js";

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");

// show register page
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// create user
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.redirect("/");

    console.log(name, email, password, role);
  } catch (error) {
    res.send("Error Accure");
    console.log("register error=>", error);
  }
});

// login User
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    console.log("getting user ", user);
    if (!user) {
      return res.render("login.ejs", { msg: "User not found" });
    } else if (user.password != password) {
      return res.render("login.ejs", { msg: "Invalid password" });
    } else {
      return res.render("profile.ejs", { user });
    }
  } catch (error) {
    res.send("Error Accure");
    console.log("login error=>", error);
  }
});

// all users
app.get("/users", async (req, res) => {
  let users = await User.find().sort({ createdAt: -1 });
  res.render("users.ejs", { users });
});

// show login page
app.get("/", (req, res) => {
  res.render("login.ejs");
});

// delete
app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);
    res.redirect("/users");
  } catch (error) {
    res.send("Error Accure");
    console.log("delete error=>", error);
  }
});

// get update
app.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let user = await User.findById({ _id: id });
    res.render("update", { user });
  } catch (error) {
    res.status(500).send("Error retrieving user");
    console.log(" get update  error=>", error);
  }
});

// post update
app.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { name, email, password, role } = req.body;

  try {
    let updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.redirect("/users");
  } catch (error) {
    res.status(500).send("Error updating user");
    console.log("post update error", error);
  }
});

mongoose
  .connect(
    "mongodb+srv://prajapatravi331:admin_ravi@cluster0.ujjwmfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      dbName: "NodeJS_Auth",
    }
  )
  .then(() => console.log("Mongodb Connected"))
  .catch((error) => console.log(error));

const port = 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
