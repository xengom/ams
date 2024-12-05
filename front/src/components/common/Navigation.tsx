import React from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";

const Navigation: React.FC = () => {
  const location = useLocation();

  const items: MenuProps["items"] = [
    {
      key: "/",
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "/portfolio",
      label: <Link to="/portfolio">Portfolio</Link>,
    },
    {
      key: "/dividend",
      label: <Link to="/dividend">Dividend</Link>,
    },
    {
      key: "/history",
      label: <Link to="/history">History</Link>,
    },
    {
      key: "/income",
      label: <Link to="/income">Income</Link>,
    },
    {
      key: "/plan",
      label: <Link to="/plan">Plan</Link>,
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "white",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
      />
    </div>
  );
};

export default Navigation;
