const publicUserFields = [
  "id",
  "username",
  "name",
  "image",
  "thumbnail",
  "level",
  "bio",
];

function isEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const fs = require("fs");
const Jimp = require("jimp");
const fileType = require("file-type");
const extensions = ["jpg", "jpeg", "png"];

const saveImageIfValid = (res, base64, thumbnail) => {
  if (!base64) {
    return {};
  }
  // to declare some path to store your converted image
  const path = "./uploads/" + Date.now() + ".png";
  const pathThumbnail = "./uploads/" + Date.now() + "tn.png";

  // to convert base64 format into random filename
  const base64Data = base64.replace(/^data:([A-Za-z-+/]+);base64,/, "");
  const mimeInfo = fileType(Buffer.from(base64Data, "base64"));

  if (extensions.includes(mimeInfo && mimeInfo.ext)) {
    fs.writeFileSync(path, base64Data, { encoding: "base64" });

    Jimp.read(path, (err, image) => {
      if (err) throw err;
      image
        .scaleToFit(512, 512) // resize
        .write(path); // save
    });

    if (thumbnail) {
      fs.writeFileSync(pathThumbnail, base64Data, { encoding: "base64" });

      Jimp.read(pathThumbnail, (err, image) => {
        if (err) throw err;
        image
          .scaleToFit(100, 100) // resize
          .write(pathThumbnail); // save
      });
    }

    return {
      pathImage: path.substring(1),
      pathThumbnail: thumbnail ? pathThumbnail.substring(1) : undefined,
    };
  } else {
    res.json({ response: "Invalid image" });
    return { invalid: true };
  }
};

const fileExtensions = ["mp3"];
const saveFileIfValid = (res, base64) => {
  if (!base64) {
    return {};
  }

  const mimeInfo = fileType(Buffer.from(base64Data, "base64"));

  if (!mimeInfo || !fileExtensions.includes(mimeInfo.ext)) {
    res.json({ response: "Invalid file" });
    return { invalid: true };
  }

  // to declare some path to store your converted image
  const path = `./uploads/${Date.now()}.${mimeInfo.ext}`;

  // to convert base64 format into random filename
  const base64Data = base64.replace(/^data:([A-Za-z-+/]+);base64,/, "");

  fs.writeFileSync(path, base64Data, { encoding: "base64" });

  return {
    pathFile: path.substring(1),
  };
};

module.exports = {
  publicUserFields,
  isEmail,
  saveImageIfValid,
  saveFileIfValid,
};
