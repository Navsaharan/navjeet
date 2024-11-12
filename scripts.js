document.addEventListener('DOMContentLoaded', function() {
    // Initialize reCAPTCHA when the DOM is loaded
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
            console.log('Recaptcha verified');
        }
    });

    // Firebase initialization
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // Helper function to display error messages
    const showError = (message) => {
        // Display error message to the user
        const errorElement = document.createElement('p');
        errorElement.className = 'error';
        errorElement.innerText = message;
        document.getElementById('form-wrapper').appendChild(errorElement);
    };

    // Phone number sign-in setup
    document.getElementById('phoneSignIn').addEventListener('click', (e) => {
        e.preventDefault();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();

        // Ensure phone number is in E.164 format
        if (!phoneNumber.startsWith('+')) {
            showError('Please enter the phone number in E.164 format (e.g., +1234567890)');
            return;
        }

        const appVerifier = window.recaptchaVerifier;
        document.getElementById('phoneSignIn').disabled = true;

        auth.signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                document.getElementById('verificationCode').style.display = 'block';
                document.getElementById('verifyCode').style.display = 'block';
            })
            .catch((error) => {
                console.error('Error during phone sign-in:', error.code, error.message);
                showError('Failed to send OTP. Please try again.');
            })
            .finally(() => {
                document.getElementById('phoneSignIn').disabled = false;
            });
    });

    // OTP verification setup
    document.getElementById('verifyCode').addEventListener('click', (e) => {
        e.preventDefault();
        const code = document.getElementById('verificationCode').value.trim();

        document.getElementById('verifyCode').disabled = true;

        window.confirmationResult.confirm(code)
            .then((result) => {
                console.log('User signed in with phone:', result.user);
                window.location.href = "dashboard.html"; // Redirect to dashboard
            })
            .catch((error) => {
                console.error('Error verifying code:', error.code, error.message);
                showError('Invalid code. Please try again.');
            })
            .finally(() => {
                document.getElementById('verifyCode').disabled = false;
            });
    });

    // Handle email-based signup and login
    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#signupForm input[type="email"]').value;
        const password = document.querySelector('#signupForm input[type="password"]').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                return userCredential.user.sendEmailVerification();
            })
            .then(() => {
                console.log('Verification email sent.');
                alert('Verification email sent. Please check your inbox.');
            })
            .catch((error) => {
                console.error('Error signing up:', error.code, error.message);
                showError('Error signing up: ' + error.message);
            });
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#loginForm input[type="email"]').value;
        const password = document.querySelector('#loginForm input[type="password"]').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                if (userCredential.user.emailVerified) {
                    console.log('User signed in:', userCredential.user);
                    window.location.href = "dashboard.html"; // Redirect to dashboard
                } else {
                    alert('Please verify your email before logging in.');
                    auth.signOut();
                }
            })
            .catch((error) => {
                console.error('Error signing in:', error.code, error.message);
                showError('Error signing in: ' + error.message);
            });
    });

    // Google sign-in setup
    document.getElementById('googleSignIn').addEventListener('click', (e) => {
        e.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {
                console.log('User signed in with Google:', result.user);
                window.location.href = "dashboard.html"; // Redirect to dashboard
            })
            .catch((error) => {
                console.error('Error signing in with Google:', error.code, error.message);
                showError('Error signing in with Google: ' + error.message);
            });
    });

    // Apple sign-in setup
    document.getElementById('appleSignIn').addEventListener('click', (e) => {
        e.preventDefault();
        const provider = new firebase.auth.OAuthProvider('apple.com');
        auth.signInWithPopup(provider)
            .then((result) => {
                console.log('User signed in with Apple:', result.user);
                window.location.href = "dashboard.html"; // Redirect to dashboard
            })
            .catch((error) => {
                console.error('Error signing in with Apple:', error.code, error.message);
                showError('Error signing in with Apple: ' + error.message);
            });
    });

    // Monitor auth state
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User state changed:', user);
        } else {
            console.log('No user is signed in.');
        }
    });

    // Handle form switches
    document.getElementById('switchToSignup').addEventListener('click', () => {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
        document.getElementById('phoneSignInForm').style.display = 'none';
    });

    document.getElementById('switchToLogin').addEventListener('click', () => {
        document.getElementById('signupForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('phoneSignInForm').style.display = 'none';
    });

    document.getElementById('switchToPhone').addEventListener('click', () => {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('phoneSignInForm').style.display = 'block';
        document.getElementById('signupForm').style.display = 'none';
    });

    document.getElementById('switchFromPhoneToLogin').addEventListener('click', () => {
        document.getElementById('phoneSignInForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    });
});
