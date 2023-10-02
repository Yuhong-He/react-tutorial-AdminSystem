import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

function NavLeft() {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState("1");
  const navigate = useNavigate();

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = () => {
    axios.get("/menus").then((res) => {
      const items = createMenu(res.data);
      setItems(items);
    });
  };

  const createMenu = (data) => {
    const menuList = [];
    data.map((item) => {
      let menu;
      if (item.children.length > 0) {
        const children = [];
        item.children.forEach((ele) => {
          const childMenu = getItem(ele.title, ele.id, "", "", "");
          children.push(childMenu);
        });
        menu = getItem(item.title, item.id, "", children, "");
      } else {
        menu = getItem(item.title, item.id, "", "", "");
      }
      menuList.push(menu);
    });
    return menuList;
  };

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    navigate(`/admin/${e.key}`);
  };

  return (
    <Menu
      theme="dark"
      onClick={onClick}
      defaultOpenKeys={["sub1"]}
      selectedKeys={[current]}
      mode="inline"
      items={items}
    ></Menu>
  );
}

export default NavLeft;
