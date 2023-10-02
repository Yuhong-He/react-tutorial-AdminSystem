import {Component} from "react";
import {Row, Col} from "antd";
import "../../style/header.css";

class Header extends Component {
    state = {
        userName: "Alex"
    }
    render() {
        return (
            <div>
                <Row className={"header-top"}>
                    <Col span={24}>
                        <span>Welcome: {this.state.userName}</span>
                    </Col>
                </Row>
                <Row className={"header"}>
                    <Col span={4} className={"header-title"}>
                        Home Page
                    </Col>
                    <Col span={20} className={"header-date"}>
                        <span>2023-10-01</span>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Header
