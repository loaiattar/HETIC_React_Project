import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Editor from "./components/Editor";
import styles from "./App.module.css";

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