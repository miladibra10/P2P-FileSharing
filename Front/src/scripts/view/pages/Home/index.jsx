import React, {useEffect} from 'react';
import {Input,Icon,Tooltip,Col,Upload, message, Button} from 'antd';
const { Search} = Input;



const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', // @TODO should change
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const searchFun = (value) => (
    console.log(value)
)

const login = (value) => (
    console.log(value)
)

const Home = () => {

    return (
        <div>
        <Search placeholder="input search text" onSearch={value => searchFun(value)} enterButton />
        <br/><br/><br/><br/><br/><br/>
        <div style={{ marginLeft:"40%"}}>
            <Col  span={8} >
                    <Input 
                    onPressEnter={value => login(value)}
                    placeholder="Enter your username"
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    suffix={
                    <Tooltip title="Extra information">
                        <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                    }
                    />
            </Col>
            </div>
            <br/><br/><br/>
            <div style={{ marginLeft:"40%"}}>
            <Col  span={8} >
            <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or other
              band files
            </p>
            
          </Dragger>
          </Col>
          </div>
        </div>

    )
}
export default Home