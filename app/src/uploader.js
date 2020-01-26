'user strict'

const fs = require('fs');
const { exec } = require('child_process');
const request = require('request');
const imgToText = require('../utils/squery');
const uuid = require('uuid/v4');
// const bucket = storage.bucket('handy-outpost-266217');


// const uploadImage = (file) => new Promise((resolve, reject) => {
//     const { buffer } = file;
//     const bucketName = 'handy-outpost-266217';
  
//     const blob = bucket.file(uuid().replace('/-/g', ''));
//     const blobStream = blob.createWriteStream({
//       resumable: false
//     });
//     blobStream.on('finish', () => {
//       const publicUrl = format(
//         `https://storage.googleapis.com/${bucketName}/${blob.name}`
//       )
//       resolve(publicUrl)
//     })
//     .on('error', (err) => {
//       reject(`Unable to upload image, something went wrong`)
//     })
//     .end(buffer)
// });

function rawBody(req, res, next) {
    var chunks = [];

    req.on('data', function(chunk) {
        chunks.push(chunk);
    });

    req.on('end', function() {
        var buffer = Buffer.concat(chunks);
        req.bodyLength = buffer.length;
        req.buffer = buffer;
        next();
    });

    req.on('error', function (err) {
        console.log(err);
        res.status(500);
    });
}

module.exports = app => {
    app.get('/test', (req, res) => {
        const bucketName = "reresults";
        storage.bucket(bucketName).getFiles(function(err, files) {
            res.status(200).send(JSON.stringify(files.length));
        });
    });

    app.post('/image_to_text', rawBody, async (req, res) => {
        const vision = require('@google-cloud/vision');
        const client = new vision.ImageAnnotatorClient();
        try {
            if(req.buffer && req.bodyLength > 0) {
                const fileName = './image.jpg';
                console.log('writing');
                fs.writeFile(fileName, req.buffer, async (err) => {
                    if(err) {
                        console.log('error 1');
                        res.status(400).send(err);
                    }
                    console.log('no error');
                    exec('../utils/squery.js');
                    // request.post('http://localhost:9000/', { text });
                    // console.log(text);
                    fs.unlink(fileName, err => {
                        console.log(err);
                    });
                    console.log("success!");
                    res.send('OK').status(200);
                });
            }
        } catch(err) {
            res.send(err).status(500);
        }
    });

    // app.post('/image_to_text', rawBody, async (req, res) => {
    //     try {
    //         if (req.buffer && req.bodyLength > 0) {
    //             uploadImage(req);
    //             res.send('OK').status(200);
    //         } else {
    //             res.send(400);
    //         }
    //     } catch(err) {
    //         res.send(err).status(500);
    //     }
    // })

    // app.post('/image_to_text', async (req, res, next) => {
    //     try {
    //         const myFile = req.file
    //         const imageUrl = await uploadImage(myFile)
    //         res
    //           .status(200)
    //           .json({
    //             message: "Upload was successful",
    //             data: imageUrl
    //           })
    //       } catch (error) {
    //           console.log(error);
    //         next(error)
    //       }
    // });
}
