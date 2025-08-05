# 🎓 BSSE SIMU Portal - Data Learning Management System

**Online Portal for Bachelor of Software and Systems Engineering (BSSE) at SIMU**

A comprehensive web-based portal designed for BSSE students and faculty at SIMU to record, track, and analyze the data learning process. This system provides real-time insights into student progress, learning objectives achievement, and academic performance analytics.

---

## ✨ Features

### 📊 **Dashboard & Analytics**
- Real-time overview of student performance metrics
- Interactive charts and visualizations using Chart.js
- Progress tracking over time
- Course-wise performance analysis
- Learning objectives achievement tracking

### 👥 **Student Management**
- Complete student profile management
- Individual progress tracking
- Detailed activity history
- Search and filter functionality
- Bulk data operations

### 📝 **Data Recording**
- Comprehensive learning activity logging
- Multiple activity types (lectures, assignments, quizzes, projects, labs, presentations)
- Learning objectives mapping
- Score/grade tracking with timestamps
- Notes and observations capture

### 📈 **Progress Visualization**
- Interactive progress charts
- Course performance comparisons
- Activity distribution analysis
- Top performers leaderboard
- Trend analysis over 30-day periods

### 💾 **Data Export & Import**
- CSV export for external analysis
- JSON export for data backup
- Structured data format for integration
- Local storage for offline capability

### 🔐 **Authentication System**
- Secure login with multiple user roles
- Session management
- Remember me functionality
- Demo credentials for testing

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local server) or any HTTP server
- Internet connection (for CDN resources)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/muhammadusman/bsse-simu-portal.git
   cd bsse-simu-portal
   ```

2. **Start a local server:**
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Or using Python 2
   python -m SimpleHTTPServer 8000
   
   # Or using Node.js (if you have live-server installed)
   npm install -g live-server
   live-server --port=8000
   ```

3. **Open your browser:**
   Navigate to `http://localhost:8000`

4. **Login with demo credentials:**
   - **Admin:** `admin` / `admin123`
   - **Student:** `student` / `student123`
   - **Teacher:** `teacher` / `teacher123`

---

## 📁 Project Structure

```
bsse-simu-portal/
├── index.html              # Main portal dashboard
├── login.html              # Authentication page
├── package.json            # Project configuration
├── README.md              # Project documentation
├── assets/
│   ├── css/
│   │   └── style.css      # Custom styles and responsive design
│   ├── js/
│   │   └── app.js         # Main application logic
│   └── images/            # Image assets (if any)
└── .git/                  # Git repository
```

---

## 🛠️ Technology Stack

### **Frontend**
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Interactive functionality and data management
- **Bootstrap 5.3** - Responsive UI framework
- **Chart.js 4.3** - Data visualization and charts
- **Font Awesome 6.4** - Icons and visual elements

### **Storage**
- **LocalStorage** - Client-side data persistence
- **SessionStorage** - Session management
- **JSON** - Data format for storage and export

### **Design**
- **Inter Font** - Modern typography
- **CSS Custom Properties** - Consistent theming
- **CSS Animations** - Smooth transitions and effects
- **Responsive Design** - Mobile-first approach

---

## 🎯 Usage Guide

### **For Students:**
1. **Login** with your credentials
2. **View Dashboard** to see your progress overview
3. **Check Analytics** to understand your learning trends
4. **Review Profile** in the Students section

### **For Faculty/Admins:**
1. **Record Learning Data** for students
2. **Manage Student Profiles** and information
3. **Analyze Performance** using charts and reports
4. **Export Data** for external analysis
5. **Track Progress** across different courses and semesters

### **Data Recording Process:**
1. Navigate to "Record Data" section
2. Enter student information (ID auto-completes if student exists)
3. Select course, semester, and activity type
4. Enter score/grade (0-100%)
5. Select relevant learning objectives
6. Add notes and observations
7. Set date/time and submit

---

## 📊 Sample Data

The portal comes with pre-loaded sample data including:
- **3 Sample Students** with different performance levels
- **Multiple Learning Records** across various courses
- **Different Activity Types** (assignments, quizzes, projects)
- **Learning Objectives** mapping
- **Time-based Data** for trend analysis

---

## 🔧 Customization

### **Adding New Courses:**
Edit the course dropdown in `index.html`:
```html
<option value="new-course">New Course Name</option>
```

### **Modifying Learning Objectives:**
Update the checkboxes in the data entry form:
```html
<input class="form-check-input" type="checkbox" id="obj6" value="new-objective">
<label class="form-check-label" for="obj6">New Objective</label>
```

### **Styling Customization:**
Modify CSS custom properties in `assets/css/style.css`:
```css
:root {
    --primary-color: #your-color;
    --gradient-primary: linear-gradient(135deg, #color1 0%, #color2 100%);
}
```

---

## 🚀 Deployment

### **GitHub Pages:**
1. Push code to GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (main/master)
4. Access via `https://yourusername.github.io/bsse-simu-portal`

### **Netlify:**
1. Connect GitHub repository to Netlify
2. Deploy automatically on push
3. Custom domain configuration available

### **Traditional Web Hosting:**
1. Upload all files to web server
2. Ensure proper file permissions
3. Access via your domain

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/AmazingFeature`
3. **Commit changes:** `git commit -m 'Add some AmazingFeature'`
4. **Push to branch:** `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### **Development Guidelines:**
- Follow existing code style and structure
- Test thoroughly across different browsers
- Ensure responsive design compatibility
- Document new features and changes
- Maintain backward compatibility

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Muhammad Usman**
- BS Software Engineering Student at SIMU
- Email: muhammad.usman@simu.edu.pk
- GitHub: [@muhammadusman](https://github.com/muhammadusman)
- LinkedIn: [Muhammad Usman](https://linkedin.com/in/muhammadusman)

---

## 🙏 Acknowledgments

- **SIMU Faculty** for guidance and requirements
- **Bootstrap Team** for the excellent UI framework
- **Chart.js Community** for powerful visualization tools
- **Font Awesome** for comprehensive icon library
- **Google Fonts** for beautiful typography

---

## 📞 Support

For support, questions, or suggestions:
- 📧 Email: muhammad.usman@simu.edu.pk
- 🐛 Issues: [GitHub Issues](https://github.com/muhammadusman/bsse-simu-portal/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/muhammadusman/bsse-simu-portal/discussions)

---

> **"Education is the most powerful weapon which you can use to change the world."** - Nelson Mandela

**Built with ❤️ for BSSE students at SIMU** 🎓
