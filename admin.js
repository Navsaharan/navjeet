document.getElementById('addStudentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const course = document.getElementById('course').value;

    fetch('/api/students/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, course }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Student added successfully!');
        loadStudents();
    })
    .catch(err => alert('Error adding student'));
});

function loadStudents() {
    fetch('/api/students')
        .then(response => response.json())
        .then(data => {
            const studentList = document.getElementById('studentList');
            studentList.innerHTML = '';
            data.forEach(student => {
                studentList.innerHTML += `<p>${student.name} - ${student.email}</p>`;
            });
        })
        .catch(err => alert('Error loading students'));
}

loadStudents();
