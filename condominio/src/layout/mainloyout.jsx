import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./mainlayout.css";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout-container">
      
      <Header>
        <button className="hamburger-btn" onClick={toggleSidebar}>
          ☰
        </button>
      </Header>

      <div className="layout-body">
        <aside className={`layout-sidebar ${sidebarOpen ? "open" : ""}`}>
          <Sidebar />
        </aside>

        <main className="layout-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
