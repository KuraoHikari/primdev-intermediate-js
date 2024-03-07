// const {
//   uniqueNamesGenerator,
//   adjectives,
//   colors,
//   animals,
// } = require("unique-names-generator");

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { AnimeWallpaper, AnimeSource } from "anime-wallpaper";
// const { AnimeWallpaper, AnimeSource } = require('anime-wallpaper');

const wallpaper = new AnimeWallpaper();

const randomWallpaper = await wallpaper.search(
  { title: "Misaka Mikoto" },
  AnimeSource.WallHaven
);
console.log("🚀 ~ randomWallpaper:", randomWallpaper);

const randomName = uniqueNamesGenerator({
  dictionaries: [colors, animals],
}); // big_red_donkey

const shortName = uniqueNamesGenerator({
  dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
  length: 2,
}); // big-donkey

console.log(randomName);

console.log(shortName);
