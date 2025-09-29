import React from "react";

const Header = ({ children }) => {
  return (
    <header>
      <h1>Smart Condominium</h1>
      {children}
    </header>
  );
};

export default Header;
