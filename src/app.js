const express = require("express");
const path = require("path");
const forecast = require("./utils/forecast");
const hbs = require("hbs");

const app = express();
const port = process.env.PORT || 3001;

const publicDirectoryPath = path.join(__dirname, "../public");

const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");
app.set("view engine", "hbs");

app.set("views", viewsPath);

hbs.registerPartials(partialPath);

app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Wather",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide a address!!",
    });
  }

  forecast(req.query.address, (error, location, forecastData) => {
    if (error) {
      return res.send({ error });
    }

    res.send({
      forecast: forecastData,
      location,
      address: req.query.address,
    });
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Page Not found",
    errorMessage: "Page Not found",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
