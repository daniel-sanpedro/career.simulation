const express = require("express");
const app = express();

require("dotenv/config");

const api = process.env.API_URL;

app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: "hair dresser",
    image: "some_url",
  };
  res.send(product);
});

app.post(api + "/products", (req, res) => {
  const product = {
    id: 1,
    name: "hair dresser",
    image: "some_url",
  };
  res.send(product);
});

app.listen(3000, () => {
  console.log(api);
  console.log("listening on port 3000");
});
