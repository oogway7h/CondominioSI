import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./mainlayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
