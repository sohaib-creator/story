const db = require('../db');

exports.getAllStories = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM stories ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getStoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM stories WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Story not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createStory = async (req, res) => {
    try {
        const { title, excerpt, content, author_id, category } = req.body;
        let image_url = '';

        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        const result = await db.query(
            'INSERT INTO stories (title, excerpt, content, image_url, author_id, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, excerpt, content, image_url, author_id, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateStory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, image_url, category } = req.body;
        const result = await db.query(
            'UPDATE stories SET title = $1, excerpt = $2, content = $3, image_url = $4, category = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            [title, excerpt, content, image_url, category, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Story not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteStory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM stories WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Story not found' });
        }
        res.json({ message: 'Story deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
