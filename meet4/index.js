import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import router from "./router.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use((req, res) => {
  res.send("route tidak ditemukan");
});
//akhir function functionnya

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
