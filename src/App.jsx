import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Editor from "./components/Editor";
import styles from "./App.module.css";

// Add Montserrat font
const montserratLink = document.createElement('link');
montserratLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap';
montserratLink.rel = 'stylesheet';
document.head.appendChild(montserratLink);

function App() {
  return (
    <Router>
      <div className={styles.appContainer}>
        <nav className={styles.navbar}>
          <Link to="/" className={styles.link}>
            Dashboard
          </Link>
          <Link to="/editor" className={styles.link}>
            Editor
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;