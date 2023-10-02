import {Component} from "react";
import {Button, message, Popconfirm, Table, Input} from "antd";
import axios from "axios";
import {API} from "../config";
import AddProduct from "../components/products/AddProduct";
import EditProduct from "../components/products/EditProduct";

const { Search } = Input;

class GoodsList extends Component {
    state = {
        dataSource: [],
        editData: {},
        total: 0,
        pageSize: 3,
        pageNumber: 1,
        searchContent: "",
        showAddProductDialog: false,
        showEditProductDialog: false
    };

    loadData = () => {
        const params = {
            pageSize: this.state.pageSize,
            pageNumber: this.state.pageNumber,
            search: this.state.searchContent
        }
        axios.get('/goods', { params }).then((res) => {
            this.setState({
                dataSource: res.data.list,
                total: res.data.totalCount
            })
        })
    }
    handleDelete = (pid) => {
        axios.delete("/goods/delete", {params: {id: pid}}).then(res => {
            if(res.data.code === "ok") {
                message.info("Delete success").then(() => {})
                this.loadData();
            } else {
                message.info("Delete failed").then(() => {})
            }
        })
    }
    changePage = (page, pageSize) => {
        this.setState({pageSize: pageSize, pageNumber: page}, () => {
            this.loadData()
        })
    }
    onSearch = (value) => {
        this.setState((preState) => {
            preState.searchContent = value;
        }, () => {
            this.loadData()
        })
    }
    handleAdd = () => {
        this.setState({showAddProductDialog: true})
    }
    handleEdit = (pid) => {
        axios.get("/goods/get", {params: {goodsId: pid} }).then((res) => {
            this.setState({
                editData: res.data,
                showEditProductDialog: true
            })
        })
    }
    closeAddDialog = () => {
        this.setState({showAddProductDialog: false})
        this.loadData()
    }
    closeEditDialog = () => {
        this.setState({showEditProductDialog: false})
        this.loadData()
    }
    showEditDialog = (flag) => {
        if(flag) {
            return (
                <EditProduct
                    visible={this.state.showEditProductDialog}
                    close={this.closeEditDialog}
                    data={this.state.editData}
                ></EditProduct>
            )
        }
    }
    componentDidMount() {
        this.loadData()
    }

    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
            },
            {
                title: 'Image',
                dataIndex: 'thumbnail',
                key: 'thumbnail',
                render: (record) => {
                    return <img src={API + record} alt={"Example"} width={50}/>
                }
            },
            {
                title: 'Operation',
                dataIndex: 'id',
                key: 'id',
                render: (record) => {
                    return (
                        <>
                            <Popconfirm
                                title={"Delete the product?"}
                                okText={"Confirm"}
                                cancelText={"Cancel"}
                                onConfirm={() => {
                                    this.handleDelete(record);
                                }}
                            >
                                <Button type={"primary"}>Delete</Button>
                            </Popconfirm>
                            <Button
                                style={{ marginLeft: "10px" }}
                                onClick={() => {
                                    this.handleEdit(record);
                                }}
                            >
                                Edit
                            </Button>
                        </>

                    )
                }
            },
        ];
        return (
            <div>
                <Search
                    placeholder="input search text"
                    allowClear
                    enterButton="Search"
                    size="large"
                    style={{width: 600, marginBottom: 20, marginTop: 10}}
                    onSearch={this.onSearch}
                />
                <Button type={"primary"} style={{margin: "15px"}} onClick={this.handleAdd}>Add Product</Button>
                <Table
                    dataSource={this.state.dataSource}
                    columns={columns}
                    rowKey="id"
                    pagination={{
                        pageSize: this.state.pageSize,
                        defaultCurrent: this.state.pageNumber,
                        onChange: this.changePage,
                        total: this.state.total
                    }} />
                <AddProduct
                    visible={this.state.showAddProductDialog}
                    close={this.closeAddDialog}
                ></AddProduct>

                {this.showEditDialog(this.state.showEditProductDialog)}
            </div>

    )
    }
}

export default GoodsList;
