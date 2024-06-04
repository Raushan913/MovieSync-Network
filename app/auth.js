document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // For simplicity, using a dummy authentication. Replace with real authentication.
    if(username === 'user' && password === 'password') {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials!');
    }
});

document.getElementById('signup-link').addEventListener('click', function() {
    alert('Sign up functionality is not implemented yet.');
});

// Check if user is already logged in
if(localStorage.getItem('loggedIn') === 'true') {
    window.location.href = 'index.html';
}
