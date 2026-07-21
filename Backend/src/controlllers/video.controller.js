const fs = require('fs');
const path = require('path');
const LinkedList = require('../data-structures/LinkedList');

// Manage video queue using LinkedList as requested
const auroraVideoIndex = new LinkedList();

exports.uploadVideo = async (req, res) => {
    // Logic for saving video file via multer/fs
    const videoData = { id: Date.now(), title: req.body.title, path: req.file.path, views: 0 };
    auroraVideoIndex.addVideo(videoData);
    res.status(201).json({ message: 'Video uploaded', video: videoData });
};

exports.streamVideo = (req, res) => {
    // Progressive video streaming logic
    const videoPath = path.join(__dirname, '../../uploads', req.params.filename);
    const videoSize = fs.statSync(videoPath).size;
    const range = req.headers.range;

    if (!range) {
        return res.status(400).send("Requires Range header");
    }

    const CHUNK_SIZE = 10 ** 6; // 1MB chunks
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
};

const multer = require('multer');
const path = require('path');
const LinkedList = require('../data-structures/LinkedList');

const auroraVideoIndex = new LinkedList();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage }).single('video');

exports.uploadVideo = (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ error: 'Upload failed' });
        
        const videoData = { 
            id: Date.now(), 
            title: req.body.title, 
            path: req.file.filename, 
            views: 0 
        };
        
        // Fulfilling the technical requirement
        auroraVideoIndex.addVideo(videoData);
        
        // Persist to MongoDB
        const db = req.app.locals.db;
        await db.collection('videos').insertOne(videoData);
        
        res.status(201).json({ message: 'Video uploaded', video: videoData });
    });
};