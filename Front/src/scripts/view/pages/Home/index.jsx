import React, {useEffect, useState, useRef} from 'react';
import {Input, Icon, Tooltip, Col, Upload, message, Button} from 'antd';
import uuid from 'uuid/v1'
import {databaseRef} from "../../../core/webrtc/firebase";

const {Search} = Input;


const {Dragger} = Upload;

const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', // @TODO should change
    onChange(info) {
        const {status} = info.file;
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


const Home = () => {
    const [storedUser, setStoredUser] = useState(null);
    const [storedUserSpec, setStoredUserSpec] = useState(null);
    const [storedUserRoomRef, setStoredUserRoomRef] = useState(null);
    const [enteredUsername, setEnteredUsername] = useState('');
    const ref = useRef()
    ref.current = {
        storedUser,
        storedUserRoomRef
    }
    useEffect(() => {
        console.log('mounting');
        return () => {
            alert('Imma Head out');
            console.log('Imma Head out');
            ref.current.storedUser.remove();
            ref.current.storedUserRoomRef.remove();
        }
    }, [])
    const createUser = (user_id, username, ip) => {
        const usersRef = databaseRef.child(`users`);
        const userRef = usersRef.child(`${username}`);
        const userSpec = {
            username,
            user_id,
            ip,
            peer: {
                id: user_id,
            }
        }
        setStoredUserSpec(userSpec)
        userRef.set(userSpec, (e) => console.log(e));
        setStoredUser(userRef);
        createRoom(username, userSpec)
    };
    const createRoom = (username, user) => {
        console.log(username, user);
        const roomRef = databaseRef.child(`rooms/${username}`);
        const userRoomRef = roomRef.child(`users/${username}`);
        roomRef.set({
            room_id: username,
        }, (e) => console.log(e));
        userRoomRef.set(user, (e) => console.log(e));
        setStoredUserRoomRef(userRoomRef)
    };
    const login = (e) => {
        setEnteredUsername(e.target.value);
        const username = e.target.value;
        const user_id = uuid();
        const ip = sessionStorage.getItem('ip')
        createUser(user_id, username, ip)

    };

    const searchFun = (value) => {
        const roomRef = databaseRef.child(`/rooms/${value}`);
        let roomExist = false;
        roomRef.on('value', (snapshot) => {
            if (snapshot !== null) {
                roomExist = true;
                console.log(snapshot.val())
            }
        });
        const userRef = databaseRef.child(`/users/${value}`);
        let userExist = false;
        userRef.on('value', (snapshot) => {
            if (snapshot !== null) {
                userExist = true;
            }
        });
        if (roomExist && userExist) {
            storedUserRoomRef.remove();
            roomRef.child(`users/${enteredUsername}`).set(storedUserSpec, (e) => {
                console.log(e)
            })
        } else {
            console.log("Not Found")
        }
    };
    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Col lg={12} md={16} xs={20} span={8} style={{marginTop: "4rem"}}>
                <Search  placeholder="search for users" onSearch={value => searchFun(value)} enterButton/>
                <Input
                    value={enteredUsername}
                    onChange={(e) => {
                        setEnteredUsername(e.target.value)
                    }}
                    style={{margin: '2rem 0'}}
                    onPressEnter={value => login(value)}
                    placeholder="Enter your username"
                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    suffix={
                        <Tooltip title="Extra information">
                            <Icon
                                type="close"
                                style={{color: 'rgba(0,0,0,.45)'}}
                                onClick={() => {
                                    setEnteredUsername('')
                                }}
                            />
                        </Tooltip>
                    }
                />
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                        band files
                    </p>

                </Dragger>
            </Col>
        </div>
    )
};
export default Home