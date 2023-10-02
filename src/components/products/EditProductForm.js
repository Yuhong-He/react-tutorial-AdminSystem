import React, {Component} from "react";
import {Button, Form, Input, message, Upload} from "antd"
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {API} from "../../config";
import {UploadOutlined} from "@ant-design/icons";
import axios from "axios";

class EditProductForm extends Component {
    state = {
        editorText: "",
        editorState: ""
    }
    formRef = React.createRef();
    setDomEditorRef = React.createRef();
    componentDidMount() {
        const {title, price, thumbnail, goodsDetail} = this.props.data;
        this.formRef.current.setFieldsValue({
            title,
            price,
            thumbnail:[{name: thumbnail, url: `${API}` + thumbnail}]
        });
        this.setDomEditorRef.current.focusEditor();
        this.setState({
            editorState: this.transformHtmlToDraftState(goodsDetail)
        })
    }
    onFinish = (values) => {
        let params = {
            title: values.title,
            price: values.price,
            goodsDetail: this.state.editorText,
            goodsId: this.props.data.id,
            thumbnail: values.thumbnail[0].response !== undefined ? values.thumbnail[0].response.msg : values.thumbnail[0].name
        }
        axios.post('/goods/edit', params).then(res => {
            message.info("Edit Success").then(() => {});
            this.props.closeModal();
        }).catch((error) => {
            console.log("error=", error)
        })
    }
    onFinishFailed = () => {

    }
    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        const arr = [];
        arr.push(e.fileList[e.fileList.length - 1]);
        return e && arr;
    };
    onEditorStateChange = (editorState) => {
        let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({
            editorText: html,
            editorState
        })
    }
    transformHtmlToDraftState = (html ="") => {
        const blocksFromHtml = htmlToDraft(html);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
        );
        return EditorState.createWithContent(contentState);
    }
    render() {
        return <div>
            <Form onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} ref={this.formRef}>
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
                            console.log(extension.toLowerCase());
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
                        ref={this.setDomEditorRef}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={this.onEditorStateChange}
                        editorState={this.state.editorState}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type={"primary"} htmlType={"submit"}>Edit</Button>
                </Form.Item>
            </Form>
        </div>
    }
}

export default EditProductForm;
