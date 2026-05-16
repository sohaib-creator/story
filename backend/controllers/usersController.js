const db = require('../db');

exports.getAllUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT id, email, full_name, role FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;
        const result = await db.query(
            'INSERT INTO users (email, password, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role',
            [email, password, full_name, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM profiles WHERE user_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
        }

        const user = result.rows[0];
        // In a real app, we'd use JWT here. For simplicity, we return the user info.
        res.json({ 
            message: 'تم تسجيل الدخول بنجاح', 
            user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
