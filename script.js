document.addEventListener('DOMContentLoaded', function() {
    // Your JavaScript code goes here
    
    // Example: Change header background color on scroll
    window.onscroll = function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = '#222';
        } else {
            header.style.backgroundColor = '#333';
        }
    };
});
