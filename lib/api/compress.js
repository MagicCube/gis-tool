import fs from "fs";
import fstream from "fstream";
import path from "path";
import tar from "tar";
import zlib from "zlib";

const inputFolder = path.resolve(__dirname, "../../templates/");
const outFile = path.resolve(__dirname, "../../download/download.gz");

fstream.Reader({ "path": inputFolder, "type": "Directory" })
  .pipe(tar.Pack())
  .pipe(zlib.Gzip())
  .pipe(fstream.Writer({ "path": outFile }));
