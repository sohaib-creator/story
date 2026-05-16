const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const storiesController = require('../controllers/storiesController');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', storiesController.getAllStories);
router.get('/:id', storiesController.getStoryById);
router.post('/', upload.single('image'), storiesController.createStory);
router.put('/:id', storiesController.updateStory);
router.delete('/:id', storiesController.deleteStory);

module.exports = router;
