const express = require('express');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');

const app = express();
const port = 8000;

const storage = new Storage({
    projectId: 'befitoutfit',
    keyFilename: 'befitoutfit-508985152d9c',
});

const bucketName = 'befitoutfit';

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req)
    const fileBuffer = req.file.buffer;

    if (!fileBuffer) {
        return res.status(400).send('No file uploaded.');
    }

    // Tentukan nama berkas yang akan disimpan di Google Cloud Storage
    const fileName = 'example_uploaded.jpg';

    // Membuat write stream untuk mengunggah berkas ke Google Cloud Storage
    const fileStream = storage.bucket(bucketName).file(fileName).createWriteStream({
        metadata: {
            contentType: 'image/png',
        }
    });

    // Menulis buffer berkas ke write stream
    fileStream.end(fileBuffer);

    // Menanggapi permintaan dengan status sukses
    res.status(200).send(`File ${fileName} uploaded to ${bucketName}.`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
