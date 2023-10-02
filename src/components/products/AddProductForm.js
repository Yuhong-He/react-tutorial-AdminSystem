import {Component} from "react";
import {Button, Form, Input, message, Upload} from "antd"
import { convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {API} from "../../config";
import {UploadOutlined} from "@ant-design/icons";
import axios from "axios";

class AddProductForm extends Component {
    state = {
        editorText: "",
    }
    onFinish = (values) => {
        let params = {
            title: values.title,
            price: values.price,
            thumbnail: values.thumbnail[0].response.msg,
            goodsDetail: this.state.editorText
        }
        axios.post('/goods/add', params).then(res => {
            message.info("Add Success").then(() => {});
            this.props.closeModal();
        }).catch((error) => {
            console.log("error=", error)
        })
    }
    onFinishFailed = () => {

    }
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    onEditorStateChange = (editorState) => {
        let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({ editorText: html })
    }
    render() {
        return <div>
        <Form onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
                    <Form.Item label={"Name"} name="title" rules={[{ required: true, message: "Please enter product name" }]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={"Price"} name="price" rules={[{ required: true, message: "Please enter product price" }]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label={"Image"}
                        name="thumbnail"
                        rules={[{ required: true, message: "Please upload the image" }]}
                        valuePropName="fileList"
                        getValueFromEvent={this.normFile}
                    >
                        <Upload
                            action={`${API}/goods/fileUpload`}
                            listType="picture"
                            beforeUpload={(file) => {
                                const extension = file.name.split('.')[-1]
                                if(!["jpg", "jpeg", "png"].includes(extension.toLowerCase())) {
                                    message.error("Please upload image format in JPG, JPEG or PNG.").then(() => {});
                                    return Upload.LIST_IGNORE;
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label={"Detail"}
                        name="goodsDetail"
                        rules={[{ required: true, message: "Please enter product detail" }]}
                    >
                        <Editor
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={this.onEditorStateChange}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type={"primary"} htmlType={"submit"}>Add</Button>
                    </Form.Item>
                </Form>
            </div>
    }
}

export default AddProductForm;
