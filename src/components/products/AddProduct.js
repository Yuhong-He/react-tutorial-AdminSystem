import {Component} from "react";
import {Modal} from "antd";
import AddProductForm from "./AddProductForm";

class AddProduct extends Component {
    closeModal = () => {
         this.props.close();
    }
    render() {
        return <Modal
            open={this.props.visible}
            title={"Add Product"}
            okText={"Add"}
            cancelText={"Cancel"}
            onCancel={ () => this.props.close() }
            destroyOnClose
        >
            <AddProductForm closeModal={this.closeModal}></AddProductForm>
        </Modal>;
    }
}

export default AddProduct
