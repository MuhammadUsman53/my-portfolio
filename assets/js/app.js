// BSSE SIMU Portal - JavaScript Application

// Global Variables
let learningData = JSON.parse(localStorage.getItem('bsseSimuData')) || [];
let students = JSON.parse(localStorage.getItem('bsseSimuStudents')) || [];
let charts = {};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateDashboard();
    loadSampleData();
});

// Initialize Application
function initializeApp() {
    // Set current date/time for form
    const now = new Date();
    const dateTimeInput = document.getElementById('dateTime');
    if (dateTimeInput) {
        dateTimeInput.value = now.toISOString().slice(0, 16);
    }
    
    // Initialize navigation
    setupNavigation();
    
    // Show loading spinner initially
    showLoading();
    
    // Simulate loading time
    setTimeout(() => {
        hideLoading();
        showSection('dashboard');
    }, 1000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Data Entry Form
    const dataEntryForm = document.getElementById('dataEntryForm');
    if (dataEntryForm) {
        dataEntryForm.addEventListener('submit', handleDataSubmission);
    }
    
    // Student Search
    const studentSearch = document.getElementById('studentSearch');
    if (studentSearch) {
        studentSearch.addEventListener('input', handleStudentSearch);
    }
    
    // Student ID autocomplete
    const studentIdInput = document.getElementById('studentId');
    if (studentIdInput) {
        studentIdInput.addEventListener('input', handleStudentIdInput);
    }
}

// Navigation Handler
function handleNavigation(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('#')) {
        const sectionId = href.substring(1);
        showSection(sectionId);
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
    }
}

// Show Section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific content
        switch(sectionId) {
            case 'dashboard':
                updateDashboard();
                break;
            case 'analytics':
                loadAnalytics();
                break;
            case 'students':
                loadStudentsTable();
                break;
        }
    }
}

// Setup Navigation
function setupNavigation() {
    // Handle hash changes
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash);
        }
    });
    
    // Handle initial hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        showSection(initialHash);
    }
}

// Data Submission Handler
function handleDataSubmission(e) {
    e.preventDefault();
    showLoading();
    
    // Get form data
    const formData = new FormData(e.target);
    const learningObjectives = [];
    
    // Get checked learning objectives
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        learningObjectives.push(checkbox.value);
    });
    
    // Create record object
    const record = {
        id: generateId(),
        studentId: formData.get('studentId') || document.getElementById('studentId').value,
        studentName: formData.get('studentName') || document.getElementById('studentName').value,
        course: document.getElementById('course').value,
        semester: document.getElementById('semester').value,
        activityType: document.getElementById('activityType').value,
        score: parseInt(document.getElementById('score').value),
        learningObjectives: learningObjectives,
        notes: document.getElementById('notes').value,
        dateTime: document.getElementById('dateTime').value,
        timestamp: new Date().toISOString()
    };
    
    // Validate required fields
    if (!record.studentId || !record.studentName || !record.course || !record.semester || 
        !record.activityType || isNaN(record.score) || !record.dateTime) {
        hideLoading();
        showAlert('Please fill in all required fields.', 'danger');
        return;
    }
    
    // Add to data array
    learningData.push(record);
    
    // Update student record
    updateStudentRecord(record);
    
    // Save to localStorage
    localStorage.setItem('bsseSimuData', JSON.stringify(learningData));
    localStorage.setItem('bsseSimuStudents', JSON.stringify(students));
    
    // Reset form
    e.target.reset();
    document.getElementById('dateTime').value = new Date().toISOString().slice(0, 16);
    
    // Update dashboard
    updateDashboard();
    
    hideLoading();
    showAlert('Learning record saved successfully!', 'success');
}

// Update Student Record
function updateStudentRecord(record) {
    let student = students.find(s => s.id === record.studentId);
    
    if (!student) {
        student = {
            id: record.studentId,
            name: record.studentName,
            email: `${record.studentId}@simu.edu.pk`,
            semester: record.semester,
            totalRecords: 0,
            totalScore: 0,
            averageScore: 0,
            lastActivity: record.timestamp,
            courses: new Set(),
            activities: new Set()
        };
        students.push(student);
    }
    
    // Update student data
    student.totalRecords++;
    student.totalScore += record.score;
    student.averageScore = Math.round(student.totalScore / student.totalRecords);
    student.lastActivity = record.timestamp;
    student.courses.add(record.course);
    student.activities.add(record.activityType);
    
    // Convert sets to arrays for storage
    student.courses = Array.from(student.courses);
    student.activities = Array.from(student.activities);
}

// Student ID Input Handler
function handleStudentIdInput(e) {
    const studentId = e.target.value;
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        document.getElementById('studentName').value = student.name;
        document.getElementById('semester').value = student.semester;
    }
}

// Student Search Handler
function handleStudentSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm) ||
        student.id.toLowerCase().includes(searchTerm)
    );
    renderStudentsTable(filteredStudents);
}

// Update Dashboard
function updateDashboard() {
    // Update stats
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalRecords').textContent = learningData.length;
    
    // Calculate average progress
    const totalScore = learningData.reduce((sum, record) => sum + record.score, 0);
    const avgProgress = learningData.length > 0 ? Math.round(totalScore / learningData.length) : 0;
    document.getElementById('avgProgress').textContent = avgProgress + '%';
    
    // Today's records
    const today = new Date().toDateString();
    const todayRecords = learningData.filter(record => 
        new Date(record.timestamp).toDateString() === today
    ).length;
    document.getElementById('todayRecords').textContent = todayRecords;
    
    // Load recent activities
    loadRecentActivities();
    
    // Load top performers
    loadTopPerformers();
}

// Load Recent Activities
function loadRecentActivities() {
    const recentActivitiesContainer = document.getElementById('recentActivities');
    if (!recentActivitiesContainer) return;
    
    const recentActivities = learningData
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
    
    if (recentActivities.length === 0) {
        recentActivitiesContainer.innerHTML = '<p class="text-muted text-center py-4">No recent activities found.</p>';
        return;
    }
    
    const activitiesHTML = recentActivities.map(activity => {
        const date = new Date(activity.timestamp);
        const timeAgo = getTimeAgo(date);
        const iconClass = getActivityIcon(activity.activityType);
        const colorClass = getScoreColor(activity.score);
        
        return `
            <div class="activity-item animate-slide-up">
                <div class="activity-icon ${colorClass}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="activity-content">
                    <h6 class="activity-title">${activity.studentName} - ${activity.course}</h6>
                    <p class="activity-meta">
                        ${activity.activityType} • Score: ${activity.score}% • ${timeAgo}
                    </p>
                </div>
            </div>
        `;
    }).join('');
    
    recentActivitiesContainer.innerHTML = activitiesHTML;
}

// Load Top Performers
function loadTopPerformers() {
    const topPerformersContainer = document.getElementById('topPerformers');
    if (!topPerformersContainer) return;
    
    const topPerformers = students
        .filter(student => student.totalRecords > 0)
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 5);
    
    if (topPerformers.length === 0) {
        topPerformersContainer.innerHTML = '<p class="text-muted text-center py-4">No data available.</p>';
        return;
    }
    
    const performersHTML = topPerformers.map((performer, index) => {
        const initial = performer.name.charAt(0).toUpperCase();
        const medal = index < 3 ? ['🥇', '🥈', '🥉'][index] : '';
        
        return `
            <div class="performer-item animate-slide-up" style="animation-delay: ${index * 0.1}s">
                <div class="performer-info">
                    <div class="performer-avatar">${initial}</div>
                    <div>
                        <p class="performer-name">${performer.name} ${medal}</p>
                    </div>
                </div>
                <div class="performer-score">${performer.averageScore}%</div>
            </div>
        `;
    }).join('');
    
    topPerformersContainer.innerHTML = performersHTML;
}

// Load Analytics
function loadAnalytics() {
    setTimeout(() => {
        createProgressChart();
        createCourseChart();
        createObjectivesChart();
        createActivityChart();
    }, 100);
}

// Create Progress Chart
function createProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (charts.progress) {
        charts.progress.destroy();
    }
    
    // Prepare data
    const last30Days = getLast30Days();
    const progressData = last30Days.map(date => {
        const dayRecords = learningData.filter(record => 
            new Date(record.timestamp).toDateString() === date.toDateString()
        );
        const avgScore = dayRecords.length > 0 
            ? dayRecords.reduce((sum, record) => sum + record.score, 0) / dayRecords.length 
            : 0;
        return Math.round(avgScore);
    });
    
    charts.progress = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last30Days.map(date => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Average Score',
                data: progressData,
                borderColor: 'rgb(13, 110, 253)',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Create Course Chart
function createCourseChart() {
    const ctx = document.getElementById('courseChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (charts.course) {
        charts.course.destroy();
    }
    
    // Prepare data
    const courseData = {};
    learningData.forEach(record => {
        if (!courseData[record.course]) {
            courseData[record.course] = [];
        }
        courseData[record.course].push(record.score);
    });
    
    const courseLabels = Object.keys(courseData);
    const courseAverages = courseLabels.map(course => {
        const scores = courseData[course];
        return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    });
    
    charts.course = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: courseLabels.map(course => course.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())),
            datasets: [{
                label: 'Average Score',
                data: courseAverages,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Create Objectives Chart
function createObjectivesChart() {
    const ctx = document.getElementById('objectivesChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (charts.objectives) {
        charts.objectives.destroy();
    }
    
    // Prepare data
    const objectivesData = {};
    learningData.forEach(record => {
        record.learningObjectives.forEach(objective => {
            if (!objectivesData[objective]) {
                objectivesData[objective] = 0;
            }
            objectivesData[objective]++;
        });
    });
    
    const objectiveLabels = Object.keys(objectivesData);
    const objectiveCounts = Object.values(objectivesData);
    
    charts.objectives = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: objectiveLabels.map(obj => obj.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())),
            datasets: [{
                data: objectiveCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Create Activity Chart
function createActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (charts.activity) {
        charts.activity.destroy();
    }
    
    // Prepare data
    const activityData = {};
    learningData.forEach(record => {
        if (!activityData[record.activityType]) {
            activityData[record.activityType] = 0;
        }
        activityData[record.activityType]++;
    });
    
    const activityLabels = Object.keys(activityData);
    const activityCounts = Object.values(activityData);
    
    charts.activity = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: activityLabels.map(activity => activity.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())),
            datasets: [{
                data: activityCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Load Students Table
function loadStudentsTable() {
    renderStudentsTable(students);
}

// Render Students Table
function renderStudentsTable(studentsData) {
    const tableBody = document.getElementById('studentsTableBody');
    if (!tableBody) return;
    
    if (studentsData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    No students found. <a href="#data-entry" class="text-primary">Add some learning records</a> to get started.
                </td>
            </tr>
        `;
        return;
    }
    
    const tableHTML = studentsData.map(student => {
        const lastActivity = student.lastActivity ? new Date(student.lastActivity).toLocaleDateString() : 'Never';
        const scoreColor = getScoreColorClass(student.averageScore);
        
        return `
            <tr>
                <td><strong>${student.id}</strong></td>
                <td>${student.name}</td>
                <td><span class="badge bg-primary">${student.semester}${getOrdinalSuffix(student.semester)} Semester</span></td>
                <td>${student.totalRecords}</td>
                <td><span class="badge ${scoreColor}">${student.averageScore}%</span></td>
                <td>${lastActivity}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewStudentDetails('${student.id}')">
                        <i class="fas fa-eye me-1"></i>View
                    </button>
                    <button class="btn btn-sm btn-outline-danger ms-1" onclick="deleteStudent('${student.id}')">
                        <i class="fas fa-trash me-1"></i>Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    tableBody.innerHTML = tableHTML;
}

// Add Student
function addStudent() {
    const studentId = document.getElementById('newStudentId').value;
    const studentName = document.getElementById('newStudentName').value;
    const studentEmail = document.getElementById('newStudentEmail').value;
    const studentSemester = document.getElementById('newStudentSemester').value;
    
    if (!studentId || !studentName || !studentEmail || !studentSemester) {
        showAlert('Please fill in all fields.', 'danger');
        return;
    }
    
    // Check if student already exists
    if (students.find(s => s.id === studentId)) {
        showAlert('Student with this ID already exists.', 'danger');
        return;
    }
    
    // Add new student
    const newStudent = {
        id: studentId,
        name: studentName,
        email: studentEmail,
        semester: studentSemester,
        totalRecords: 0,
        totalScore: 0,
        averageScore: 0,
        lastActivity: null,
        courses: [],
        activities: []
    };
    
    students.push(newStudent);
    localStorage.setItem('bsseSimuStudents', JSON.stringify(students));
    
    // Clear form
    document.getElementById('addStudentForm').reset();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
    modal.hide();
    
    // Refresh table and dashboard
    loadStudentsTable();
    updateDashboard();
    
    showAlert('Student added successfully!', 'success');
}

// View Student Details
function viewStudentDetails(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const studentRecords = learningData.filter(record => record.studentId === studentId);
    
    let detailsHTML = `
        <div class="modal fade" id="studentDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Student Details - ${student.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>Student ID:</strong> ${student.id}<br>
                                <strong>Name:</strong> ${student.name}<br>
                                <strong>Email:</strong> ${student.email}
                            </div>
                            <div class="col-md-6">
                                <strong>Semester:</strong> ${student.semester}<br>
                                <strong>Total Records:</strong> ${student.totalRecords}<br>
                                <strong>Average Score:</strong> ${student.averageScore}%
                            </div>
                        </div>
                        <h6>Recent Activities:</h6>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Course</th>
                                        <th>Activity</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
    `;
    
    studentRecords.slice(-10).reverse().forEach(record => {
        detailsHTML += `
            <tr>
                <td>${new Date(record.timestamp).toLocaleDateString()}</td>
                <td>${record.course}</td>
                <td>${record.activityType}</td>
                <td><span class="badge ${getScoreColorClass(record.score)}">${record.score}%</span></td>
            </tr>
        `;
    });
    
    detailsHTML += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('studentDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', detailsHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('studentDetailsModal'));
    modal.show();
    
    // Clean up when modal is hidden
    document.getElementById('studentDetailsModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Delete Student
function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student and all their records?')) {
        return;
    }
    
    // Remove student
    students = students.filter(s => s.id !== studentId);
    
    // Remove student's learning records
    learningData = learningData.filter(record => record.studentId !== studentId);
    
    // Update localStorage
    localStorage.setItem('bsseSimuStudents', JSON.stringify(students));
    localStorage.setItem('bsseSimuData', JSON.stringify(learningData));
    
    // Refresh UI
    loadStudentsTable();
    updateDashboard();
    
    showAlert('Student deleted successfully!', 'success');
}

// Export Functions
function exportToCSV() {
    if (learningData.length === 0) {
        showAlert('No data to export.', 'warning');
        return;
    }
    
    const headers = ['Student ID', 'Student Name', 'Course', 'Semester', 'Activity Type', 'Score', 'Learning Objectives', 'Notes', 'Date Time'];
    const csvContent = [
        headers.join(','),
        ...learningData.map(record => [
            record.studentId,
            `"${record.studentName}"`,
            record.course,
            record.semester,
            record.activityType,
            record.score,
            `"${record.learningObjectives.join('; ')}"`,
            `"${record.notes || ''}"`,
            record.dateTime
        ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, 'bsse-simu-learning-data.csv', 'text/csv');
    showAlert('Data exported to CSV successfully!', 'success');
}

function exportToJSON() {
    if (learningData.length === 0) {
        showAlert('No data to export.', 'warning');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        totalRecords: learningData.length,
        students: students,
        learningData: learningData
    };
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, 'bsse-simu-learning-data.json', 'application/json');
    showAlert('Data exported to JSON successfully!', 'success');
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

function getActivityIcon(activityType) {
    const icons = {
        'lecture': 'fas fa-chalkboard-teacher',
        'assignment': 'fas fa-file-alt',
        'quiz': 'fas fa-question-circle',
        'project': 'fas fa-project-diagram',
        'lab': 'fas fa-flask',
        'presentation': 'fas fa-presentation'
    };
    return icons[activityType] || 'fas fa-book';
}

function getScoreColor(score) {
    if (score >= 90) return 'bg-success';
    if (score >= 80) return 'bg-info';
    if (score >= 70) return 'bg-warning';
    return 'bg-danger';
}

function getScoreColorClass(score) {
    if (score >= 90) return 'bg-success';
    if (score >= 80) return 'bg-info';
    if (score >= 70) return 'bg-warning';
    return 'bg-danger';
}

function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j == 1 && k != 11) return 'st';
    if (j == 2 && k != 12) return 'nd';
    if (j == 3 && k != 13) return 'rd';
    return 'th';
}

function getLast30Days() {
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date);
    }
    return days;
}

function showAlert(message, type = 'info') {
    // Remove existing alerts
    document.querySelectorAll('.alert-custom').forEach(alert => alert.remove());
    
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show alert-custom" role="alert" style="position: fixed; top: 90px; right: 20px; z-index: 9999; min-width: 300px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', alertHTML);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const alert = document.querySelector('.alert-custom');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

function showLoading() {
    document.getElementById('loadingSpinner').classList.add('show');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.remove('show');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // In a real application, this would clear authentication tokens
        showAlert('Logged out successfully!', 'info');
        // Redirect to login page or clear session
    }
}

// Load Sample Data
function loadSampleData() {
    if (learningData.length === 0 && students.length === 0) {
        // Add sample students
        const sampleStudents = [
            {
                id: 'BSSE-2021-001',
                name: 'Ahmad Hassan',
                email: 'ahmad.hassan@simu.edu.pk',
                semester: '6',
                totalRecords: 8,
                totalScore: 680,
                averageScore: 85,
                lastActivity: new Date(Date.now() - 86400000).toISOString(),
                courses: ['web-development', 'database-systems'],
                activities: ['assignment', 'quiz', 'project']
            },
            {
                id: 'BSSE-2021-002',
                name: 'Fatima Ali',
                email: 'fatima.ali@simu.edu.pk',
                semester: '6',
                totalRecords: 12,
                totalScore: 1080,
                averageScore: 90,
                lastActivity: new Date(Date.now() - 3600000).toISOString(),
                courses: ['machine-learning', 'software-engineering'],
                activities: ['lecture', 'assignment', 'presentation']
            },
            {
                id: 'BSSE-2022-003',
                name: 'Muhammad Usman',
                email: 'muhammad.usman@simu.edu.pk',
                semester: '4',
                totalRecords: 6,
                totalScore: 480,
                averageScore: 80,
                lastActivity: new Date(Date.now() - 7200000).toISOString(),
                courses: ['data-structures', 'web-development'],
                activities: ['lab', 'quiz', 'assignment']
            }
        ];
        
        // Add sample learning data
        const sampleLearningData = [
            {
                id: generateId(),
                studentId: 'BSSE-2021-001',
                studentName: 'Ahmad Hassan',
                course: 'web-development',
                semester: '6',
                activityType: 'assignment',
                score: 88,
                learningObjectives: ['technical-skills', 'problem-solving'],
                notes: 'Excellent work on responsive design',
                dateTime: new Date(Date.now() - 86400000).toISOString().slice(0, 16),
                timestamp: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: generateId(),
                studentId: 'BSSE-2021-002',
                studentName: 'Fatima Ali',
                course: 'machine-learning',
                semester: '6',
                activityType: 'project',
                score: 95,
                learningObjectives: ['critical-thinking', 'technical-skills', 'problem-solving'],
                notes: 'Outstanding implementation of neural network',
                dateTime: new Date(Date.now() - 3600000).toISOString().slice(0, 16),
                timestamp: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: generateId(),
                studentId: 'BSSE-2022-003',
                studentName: 'Muhammad Usman',
                course: 'data-structures',
                semester: '4',
                activityType: 'quiz',
                score: 82,
                learningObjectives: ['problem-solving', 'technical-skills'],
                notes: 'Good understanding of algorithms',
                dateTime: new Date(Date.now() - 7200000).toISOString().slice(0, 16),
                timestamp: new Date(Date.now() - 7200000).toISOString()
            }
        ];
        
        students = sampleStudents;
        learningData = sampleLearningData;
        
        localStorage.setItem('bsseSimuStudents', JSON.stringify(students));
        localStorage.setItem('bsseSimuData', JSON.stringify(learningData));
        
        updateDashboard();
    }
}