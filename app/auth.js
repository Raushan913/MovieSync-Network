const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Placeholder authentication
    if (username === 'user' && password === 'password') {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials');
    }
});
