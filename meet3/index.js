import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//struktur data
//Buku memiliki pemilik yang meletakan buku di Library App kita
//kita akan mencatat judul buku, deskripsi bukunya, gambar sampul
//, pemilik buku, jumlah halaman buku

// let Library = [
//   {
//     judul: "mari-ngoding",
//     deskripsi: "buku tentang ngoding",
//     sampul: "link sampul",
//     halaman: 100,
//     pemilik: "kurao",
//   },
//   {
//     judul: "ini-dari-x-url-encode",
//     deskripsi: "percobaan yang mantap",
//     sampul: "logo buku",
//     halaman: 500,
//     pemilik: "mail",
//   },
// ];

//ini routes
app.get("/books", async (req, res) => {
  const books = await prisma.book.findMany();
  res.status(200).send(books);
});

app.get("/book/:id", async (req, res) => {
  //ambil id buku dari params id
  // console.log(req.params);
  const id = +req.params.id;

  //temukan buku berdasarkan id tsb di dalam database table book
  const book = await prisma.book.findUnique({ where: { id: id } });

  res.status(200).send(book);
});

app.post("/book/create", postMethod);
app.patch("/book/edit/:id", patchMethod);

app.put("/book/put", putMethod);
app.delete("/book/delete/:id", deleteMethod);
//akhir route

//ini function functionnya
async function postMethod(req, res) {
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
  const createBook = await prisma.book.create({
    data: {
      ...book,
    },
  });

  //kirim semua data buku dari Library setelah di tambahkan
  res.status(201).send(createBook);
}

async function patchMethod(req, res) {
  //ambil judul buku dari params judul
  const id = +req.params.id;

  const book = {
    judul: req.body.judul,
    deskripsi: req.body.deskripsi,
    sampul: req.body.sampul,
    halaman: Number(req.body.halaman),
    pemilik: req.body.pemilik,
  };

  const findBook = await prisma.book.findUnique({ where: { id: id } });

  if (!findBook) {
    return res.status(404).send({ message: "book not found" });
  } else {
    const updateBook = await prisma.book.update({
      where: {
        id: id,
      },
      data: {
        ...book,
      },
    });

    return res.status(200).send(updateBook);
  }
}

function putMethod(req, res) {
  res.send("ini put");
}

async function deleteMethod(req, res) {
  //ambil judul buku dari params judul
  const id = +req.params.id;

  const findBook = await prisma.book.findUnique({ where: { id: id } });

  if (!findBook) {
    return res.status(404).send({ message: "book not found" });
  } else {
    await prisma.book.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).send({ message: "book has been deleted" });
  }
}

app.use((req, res) => {
  res.send("route tidak ditemukan");
});
//akhir function functionnya

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
