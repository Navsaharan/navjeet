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

// Check authentication state
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        // User is not logged in, redirect to login page
        window.location.href = "index.html";
    } else {
        // User is logged in, load dashboard
        loadProfile(user);
        displayCourses();
    }
});

function loadProfile(user) {
    document.getElementById('profile-name').textContent = user.displayName || 'User';
    document.getElementById('profile-email').textContent = user.email;
    if (user.photoURL) {
        document.getElementById('profile-pic').src = user.photoURL;
    }
    document.getElementById('edit-name').value = user.displayName || '';
    document.getElementById('edit-email').value = user.email;
}

function displayCourses() {
    const courses = [
        { title: "Web Development", description: "Learn the basics of HTML, CSS, and JavaScript." },
        { title: "Python for Beginners", description: "Get started with Python programming." },
        { title: "Data Science", description: "An introductory course to Data Science and Analytics." }
    ];

    const coursesContainer = document.getElementById('courses-container');
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div>
                <h3>${course.title}</h3>
                <p>${course.description}</p>
            </div>
            <button onclick="enrollCourse('${course.title}')">Enroll</button>
        `;
        coursesContainer.appendChild(courseCard);
    });
}

function enrollCourse(courseTitle) {
    alert(`You have enrolled in ${courseTitle}`);
}

function editProfile() {
    document.getElementById('edit-profile-modal').style.display = 'block';
}

function closeEditProfile() {
    document.getElementById('edit-profile-modal').style.display = 'none';
}

function saveProfile() {
    const user = firebase.auth().currentUser;
    const displayName = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const profilePic = document.getElementById('edit-profile-pic').files[0];

    if (displayName) {
        user.updateProfile({
            displayName: displayName
        }).then(() => {
            document.getElementById('profile-name').textContent = displayName;
        }).catch(error => {
            console.error('Error updating display name:', error);
            alert('Error updating display name');
        });
    }

    if (profilePic) {
        const storageRef = firebase.storage().ref();
        const userPicRef = storageRef.child('profile-pics/' + user.uid + '.jpg');
        userPicRef.put(profilePic).then(snapshot => {
            return snapshot.ref.getDownloadURL();
        }).then(downloadURL => {
            return user.updateProfile({
                photoURL: downloadURL
            }).then(() => {
                document.getElementById('profile-pic').src = downloadURL;
            });
        }).catch(error => {
            console.error('Error uploading or updating profile picture:', error);
            alert('Error uploading or updating profile picture');
        });
    }

    if (email) {
        user.updateEmail(email).then(() => {
            document.getElementById('profile-email').textContent = email;
        }).catch(error => {
            console.error('Error updating email:', error);
            alert('Error updating email');
        });
    }

    closeEditProfile();
    alert('Profile updated successfully');
}
