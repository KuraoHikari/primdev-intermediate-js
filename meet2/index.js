import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//struktur data
//Buku memiliki pemilik yang meletakan buku di Library App kita
//kita akan mencatat judul buku, deskripsi bukunya, gambar sampul
//, pemilik buku, jumlah halaman buku

let Library = [
  {
    judul: "mari-ngoding",
    deskripsi: "buku tentang ngoding",
    sampul: "link sampul",
    halaman: 100,
    pemilik: "kurao",
  },
  {
    judul: "ini-dari-x-url-encode",
    deskripsi: "percobaan yang mantap",
    sampul: "logo buku",
    halaman: 500,
    pemilik: "mail",
  },
];

//ini routes
app.get("/books", (req, res) => {
  res.status(200).send(Library);
});

app.get("/book/:judul", (req, res) => {
  //ambil judul buku dari params judul
  console.log(req.params);
  const judul = req.params.judul;

  let book = {};

  //temukan di dalam library judul buku dengan
  //iterasi semua list buku yang ada
  for (let index = 0; index < Library.length; index++) {
    const element = Library[index];
    //jika judul buku di library sama dengan buku yang di req user masukan ke dalam book
    if (element.judul === judul) {
      book = element;
    }
  }

  //kirim detail bukunya
  res.status(200).send(book);
});

app.post("/book/create", postMethod);
app.patch("/book/edit/:judul", patchMethod);

app.put("/book/put", putMethod);
app.delete("/book/delete/:judul", deleteMethod);
//akhir route

//ini function functionnya
function postMethod(req, res) {
  //ambil data input dari user
  //konvert menjadi tipe data yang sesuai standar yang telah di sepakati
  const book = {
    judul: req.body.judul,
    deskripsi: req.body.deskripsi,
    sampul: req.body.sampul,
    halaman: Number(req.body.halaman),
    pemilik: req.body.pemilik,
  };

  //tambahkan data input dari user ke dalam Library
  Library.push(book);

  //kirim semua data buku dari Library setelah di tambahkan
  res.status(201).send(Library);
}

function patchMethod(req, res) {
  //ambil judul buku dari params judul
  const judul = req.params.judul;

  const book = {
    judul: req.body.judul,
    deskripsi: req.body.deskripsi,
    sampul: req.body.sampul,
    halaman: Number(req.body.halaman),
    pemilik: req.body.pemilik,
  };

  //iterasi semua list buku yang ada
  //buat flagging kalau bukunya ditemukan
  let judulDitemukan = false;
  for (let index = 0; index < Library.length; index++) {
    const element = Library[index];
    //jika judul buku di library sama dengan buku yang di req user masukan ke dalam book
    if (element.judul === judul) {
      judulDitemukan = true;
      Library[index] = book;
    }
  }

  if (judulDitemukan === true) {
    res.status(200).send(Library);
  } else {
    res.status(404).send({ message: "not found" });
  }
}

function putMethod(req, res) {
  res.send("ini put");
}

function deleteMethod(req, res) {
  //ambil judul buku dari params judul
  console.log(req.params);
  const judul = req.params.judul;

  let books = [];

  //temukan di dalam library judul buku dengan
  //iterasi semua list buku yang ada
  for (let index = 0; index < Library.length; index++) {
    const element = Library[index];
    //jika judul buku di tidak sama dengan judul buku yang di kirim oleh user
    //maka assign buku tersebut ke vriable penampung
    if (element.judul !== judul) {
      books.push(element);
    }
  }

  //assign semua isi variable penampung ke Library kita
  Library = books;

  //kirim semua list bukunya
  res.status(200).send(Library);
}

app.use((req, res) => {
  res.send("route tidak ditemukan");
});
//akhir function functionnya

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
