// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDMeoBOr0eFa3iJWnMXB9srewDAIW0W9Lw",
    authDomain: "rajaramwith.firebaseapp.com",
    projectId: "rajaramwith",
    storageBucket: "rajaramwith.firebasestorage.app",
    messagingSenderId: "934449169578",
    appId: "1:934449169578:web:b8e906f34f6055f950fcd3",
    measurementId: "G-SWWM7QL4QL"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.elements[1].value;
    const password = e.target.elements[2].value;
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            userCredential.user.sendEmailVerification()
                .then(() => {
                    console.log('Verification email sent.');
                    alert('Verification email sent. Please check your inbox.');
                }).catch((error) => {
                    console.error('Error sending verification email:', error.message);
                });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error('Error signing up:', errorCode, errorMessage);
        });
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    const password = e.target.elements[1].value;
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
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error('Error signing in:', errorCode, errorMessage);
        });
});

// Google sign-in setup
document.getElementById('googleSignIn').addEventListener('click', (e) => {
    e.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log('User signed in with Google:', result.user);
            window.location.href = "dashboard.html"; // Redirect to dashboard
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error('Error signing in with Google:', errorCode, errorMessage);
        });
});

// Apple sign-in setup
document.getElementById('appleSignIn').addEventListener('click', (e) => {
    e.preventDefault();
    var provider = new firebase.auth.OAuthProvider('apple.com');
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log('User signed in with Apple:', result.user);
            window.location.href = "dashboard.html"; // Redirect to dashboard
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error('Error signing in with Apple:', errorCode, errorMessage);
        });
});

// Phone number sign-in setup
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': (response) => {
        console.log('Recaptcha verified');
    }
});

document.getElementById('phoneSignIn').addEventListener('click', (e) => {
    e.preventDefault();
    const phoneNumber = document.getElementById('phoneNumber').value;
    const appVerifier = window.recaptchaVerifier;

    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            document.getElementById('verificationCode').style.display = 'block';
            document.getElementById('verifyCode').style.display = 'block';
        })
        .catch((error) => {
            console.error('Error during phone sign-in:', error);
        });
});

document.getElementById('verifyCode').addEventListener('click', (e) => {
    e.preventDefault();
    const code = document.getElementById('verificationCode').value;

    window.confirmationResult.confirm(code).then((result) => {
        console.log('User signed in with phone:', result.user);
        window.location.href = "dashboard.html"; // Redirect to dashboard
    }).catch((error) => {
        console.error('Error verifying code:', error);
    });
});

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

// Monitor auth state
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User state changed:', user);
    } else {
        console.log('No user is signed in.');
    }
});
