var admin = require("firebase-admin");

var serviceAccount = require("../config/firebase-key.json");

const BUCKET = "senai-overflow-c350e.appspot.com";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET,
});

const bucket = admin.storage().bucket();

const uploadImage = (req, res, next) => {
    if(!req.file) return next();

    const imagem = req.file;
    const nomeArquivo = Date.now() + "." + imagem.originalname.split(".").pop();

    const file = bucket.file(nomeArquivo);

    const stream = file.createWriteStream({
        metadata: {
            contentType: imagem.mimetype,
        }
    });

    stream.on("error", (e) => {
        console.error(e);
    });

    stream.on("finish", async () => {
        await file.makePublic()

        req.file.firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${nomeArquivo}`;

        next();
    });

    stream.end(imagem.buffer);
}

module.exports = uploadImage;