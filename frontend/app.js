const API_URL = '/api';

// --- Auth Functions ---

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(result.user));
            alert(result.message);
            window.location.href = 'index.html';
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('حدث خطأ أثناء الاتصال بالسيرفر');
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.reload();
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const nav = document.querySelector('nav ul');
    const header = document.querySelector('header');
    
    if (user) {
        // Logged in
        if (nav && !document.getElementById('logout-link')) {
            nav.innerHTML += `<li><a href="#" id="logout-link" onclick="logout()">خروج</a></li>`;
        }
        // Show create button if on index
        const createBtn = document.querySelector('.btn[href="create.html"]');
        if (createBtn) createBtn.style.display = 'block';
    } else {
        // Not logged in
        if (nav && !document.getElementById('login-link')) {
            nav.innerHTML += `<li><a href="login.html" id="login-link">دخول المشرف</a></li>`;
        }
        // Hide create button if on index
        const createBtn = document.querySelector('.btn[href="create.html"]');
        if (createBtn) createBtn.style.display = 'none';
    }
}

// --- Story Functions ---

async function fetchAllStories() {
    const container = document.getElementById('stories-container');
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/stories`);
        const stories = await response.json();

        if (stories.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">لا توجد قصص متاحة حالياً.</p>';
            return;
        }

        container.innerHTML = stories.map(story => `
            <div class="story-card animate-fade">
                <img src="${story.image_url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23'}" alt="${story.title}">
                <div class="story-content">
                    <span class="story-category">${story.category || 'عام'}</span>
                    <h3 class="story-title">${story.title}</h3>
                    <p class="story-excerpt">${story.excerpt}</p>
                    <div class="story-footer">
                        <span class="story-date">${new Date(story.created_at).toLocaleDateString('ar-EG')}</span>
                        <a href="story.html?id=${story.id}" class="btn btn-secondary">اقرأ المزيد</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching stories:', error);
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--danger);">حدث خطأ أثناء تحميل القصص.</p>';
    }
}

async function fetchStoryDetail(id) {
    const container = document.getElementById('story-detail');
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/stories/${id}`);
        if (!response.ok) throw new Error('Story not found');
        
        const story = await response.json();
        const user = JSON.parse(localStorage.getItem('user'));

        container.innerHTML = `
            <div class="detail-header">
                <img src="${story.image_url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23'}" alt="${story.title}">
                <div class="detail-overlay">
                    <span class="story-category">${story.category || 'عام'}</span>
                    <h1 style="font-size: 3rem; margin-top: 1rem;">${story.title}</h1>
                </div>
            </div>
            <div class="detail-content">
                <div style="display: flex; gap: 1rem; color: var(--text-muted); margin-bottom: 2rem;">
                    <span>تاريخ النشر: ${new Date(story.created_at).toLocaleDateString('ar-EG')}</span>
                    <span>|</span>
                    <span>القسم: ${story.category || 'عام'}</span>
                </div>
                <div class="story-full-text">
                    ${story.content.split('\n').map(p => `<p>${p}</p>`).join('')}
                </div>
                <div style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border); display: flex; gap: 1rem;">
                    ${user ? `<button onclick="deleteStory(${story.id})" class="btn" style="background: var(--danger);">حذف هذه القصة</button>` : ''}
                    <a href="index.html" class="btn btn-secondary">العودة للرئيسية</a>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching story detail:', error);
        container.innerHTML = '<p style="text-align: center; color: var(--danger);">تعذر تحميل تفاصيل القصة.</p>';
    }
}

async function handleCreateStory(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        alert('يجب تسجيل الدخول أولاً');
        return;
    }

    formData.append('author_id', user.id);

    try {
        const response = await fetch(`${API_URL}/stories`, {
            method: 'POST',
            body: formData // No need for Content-Type header when sending FormData
        });

        if (response.ok) {
            alert('تم نشر القصة بنجاح!');
            window.location.href = 'index.html';
        } else {
            const error = await response.json();
            alert(`خطأ: ${error.error}`);
        }
    } catch (error) {
        console.error('Error creating story:', error);
        alert('حدث خطأ أثناء محاولة نشر القصة.');
    }
}

async function deleteStory(id) {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذه القصة؟')) return;

    try {
        const response = await fetch(`${API_URL}/stories/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('تم حذف القصة بنجاح.');
            window.location.href = 'index.html';
        } else {
            alert('تعذر حذف القصة.');
        }
    } catch (error) {
        console.error('Error deleting story:', error);
        alert('حدث خطأ أثناء محاولة الحذف.');
    }
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    if (document.getElementById('stories-container')) {
        fetchAllStories();
    }
});
