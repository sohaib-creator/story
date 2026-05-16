-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user'
);

-- Stories Table
CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    author_id INTEGER REFERENCES users(id),
    category VARCHAR(100),
    language VARCHAR(10) DEFAULT 'ar',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data if tables are empty
INSERT INTO users (email, password, full_name, role) 
VALUES ('s0hebsaid94@gmail.com', '987654', 'مدير النظام', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO stories (title, excerpt, content, image_url, category)
VALUES 
('قصة من التراث', 'وصف قصير لهذه القصة التراثية الجميلة...', 'هنا نكتب محتوى القصة الكامل والذي يتحدث عن أحداث مشوقة من الماضي العريق.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000', 'تراث'),
('رحلة عبر الزمن', 'استكشاف للحياة في العصور القديمة وكيف كانت المعيشة.', 'المحتوى هنا يتناول تفاصيل دقيقة عن الحياة اليومية والتقاليد الموروثة التي شكلت حضارتنا اليوم.', 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1000', 'تاريخ')
ON CONFLICT DO NOTHING;
