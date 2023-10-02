import {Component} from "react";
import {Modal} from "antd";
import EditProductForm from "./EditProductForm";

class EditorProduct extends Component {
    closeModal = () => {
        this.props.close();
    }
    render() {
        return (
            <div>
                <Modal
                    open={this.props.visible}
                    title="Edit Product"
                    okText="Edit"
                    cancelText="Cancel"
                    width="800px"
                    onCancel={() => this.props.close()}
                >
                    <EditProductForm data={this.props.data} closeModal={this.closeModal}></EditProductForm>
                </Modal>
            </div>
        );
    }
}

export default EditorProduct
