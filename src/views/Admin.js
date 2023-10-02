import {Component} from "react";
import {Row, Col} from "antd";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import NavLeft from "../components/layout/NavLeft";
import "../style/common.css";

class Admin extends Component {
    render() {
        return (
            <Row className={"container"}>
                <Col span={3} className={"nav-left"}>
                    <NavLeft></NavLeft>
                </Col>
                <Col span={21} className={"main"}>
                    <Header></Header>
                    <Row className={"content"}>
                        {this.props.children}
                    </Row>
                    <Footer></Footer>
                </Col>
            </Row>
        )
    }
}

export default Admin
