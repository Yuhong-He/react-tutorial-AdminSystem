import React, { Component } from 'react';
import { Menu } from 'antd';
import axios from "axios";
import { Link } from "react-router-dom";

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

let items = [];

class NavLeft extends Component {
    state = {
        items: []
    };

    componentDidMount() {
        this.loadMenu();
    }

    loadMenu() {
        axios.get('/menus').then(res => {
            const items = this.createMenu(res.data);
            this.setState({
                items: items
            })
        })
    }

    createMenu(data) {
        const menuList = [];
        data.map((item) => {
            let menu;
            if(item.children.length > 0) {
                const children = [];
                item.children.forEach(ele => {
                    const childMenu = getItem(ele.title, ele.id, "", "", "")
                    children.push(childMenu);
                })
                menu = getItem(item.title, item.id, "", children, "")
            } else {
                menu = getItem(item.title, item.id, "", "", "")
            }
            menuList.push(menu)
        })
        return menuList
    }

    constructor(props) {
        super(props);
        this.state = {
            current: '1'
        };
    }

    onClick = (e) => {
        console.log('click ', e);
        this.setState({ current: e.key });
    }

    render() {
        return (
            <Menu
                theme="dark"
                onClick={this.onClick}
                defaultOpenKeys={['sub1']}
                selectedKeys={[this.state.current]}
                mode="inline"
                items={this.state.items}
            />
        );
    }
}

export default NavLeft;
