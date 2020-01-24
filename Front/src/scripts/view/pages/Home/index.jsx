import React, {useEffect, useState, useRef} from 'react';
import {Input, Icon, Tooltip, Col, Upload, message, Button, Avatar, Divider, Row, Descriptions} from 'antd';
import uuid from 'uuid/v1'
import {databaseRef} from "../../../core/webrtc/firebase";
import {createOffer, onopen, handleOffer} from "../../../core/webrtc/web-rtc";

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
    const [peer, setPeer] = useState(null);
    const [userCreated, setUserCreated] = useState(false);
    const [roomCreated, setRoomCreated] = useState(false);
    const [peerCreated, setPeerCreated] = useState(false);
    const [peerRef, setPeerRef] = useState(null);
    const ref = useRef();

    ref.current = {
        storedUser,
        storedUserRoomRef
    }
    useEffect(() => {
        return () => {
            ref.current.storedUser.remove();
            ref.current.storedUserRoomRef.remove();
        }
    }, []);
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
        };
        setStoredUserSpec(userSpec);
        userRef.set(userSpec, (e) => {
            if (e === null) {
                setUserCreated(true);
            } else {
                return false;
            }
            ;
        });
        setStoredUser(userRef);
        createRoom(username, userSpec)
    };
    const createRoom = (username, user) => {
        console.log(username, user);
        const roomRef = databaseRef.child(`rooms/${username}`);
        const userRoomRef = roomRef.child(`users/${username}`);
        roomRef.set({
            room_id: username,
        }, (e) => {
            if (e === null) {
                setRoomCreated(true);
            } else {
                console.log(e);
                return false;
            }
        });
        userRoomRef.set(user, (e) => console.log(e));
        roomChange(roomRef);

        // onOfferReceived(userRoomRef, peerRef);

        setStoredUserRoomRef(userRoomRef)
    };
    const login = (e) => {
        setEnteredUsername(e.target.value);
        const username = e.target.value;
        const user_id = uuid();
        const ip = sessionStorage.getItem('ip');
        createUser(user_id, username, ip);
        onopen();
    };
    const roomChange = (roomRef) => {
        console.log('track room changes')
        roomRef.on('value', (snapshot) => {
            console.log('new snapshot', snapshot.val())
            if (snapshot.val() !== null) {
                const users = snapshot.val().users !== null ? snapshot.val().users : undefined;
                console.log('users in snapshot : ', users);
                if (users && Object.keys(users).length > 1 && !peerCreated) {
                    Object.keys(users).map((username) => {
                        console.log(username)
                        if (username !== enteredUsername) {
                            const newPeer = users[username]
                            setPeer(newPeer)
                            // setPeerRef(roomRef.child(`users/${username}`))
                            setPeerCreated(true)
                        }
                    })
                }
            }
        })
    }
    const onOfferReceived = (userRoomRef, peerRef) => {
        console.log('user room ref', userRoomRef);
        console.log("peer ref offer on offer", peerRef)
        console.log('track offer receive');
        // userRoomRef.on('child_added', (data) => {
        //     // if data.val
        //     console.log('offer received: ', data.val());
        //     if (data.val().event === "offer"){
        //         console.log("giving answer")
        //         console.log(data.val())
        //         handleOffer(data.val(),peerRef)
        //     }
        //
        // })
    }
    const searchFun = (value) => {
        const roomRef = databaseRef.child(`/rooms/${value}`);
        roomRef.on('value', (roomSnapshot) => {
            if (roomSnapshot === null) {
                console.log('room does not exist');
                return
            }
            const users = roomSnapshot.val() !== null ? roomSnapshot.val().users : undefined
            if (users && Object.keys(users).length === 1) {
                setPeer(users[Object.keys(users)[0]]);
                setPeerRef(roomRef.child(`/users/${value}`))
            }
            const userRef = databaseRef.child(`/users/${value}`);
            // setStoredUserRoomRef(userRef);
            // onOfferReceived(userRef);
            userRef.once('value', (userSnapShot) => {
                if (userSnapShot === null) {
                    console.log('user does not exist');
                    return
                }

                roomRef.child(`users/${enteredUsername}`).set(storedUserSpec, (e) => {
                    if (e === null) {
                        console.log('user added to room');
                    } else {
                        console.log(e);
                    }
                });
                if (storedUserRoomRef !== null) {
                    storedUserRoomRef.remove();
                }
                setStoredUserRoomRef(roomRef);
                roomChange(roomRef)
                roomRef.child(`/users/${enteredUsername}`).once('value', (newUserSnapshot) => {
                    if (newUserSnapshot !== null) {
                        setStoredUserRoomRef(roomRef.child(`/users/${enteredUsername}`))

                    }
                })
            })
        })
    };
    const handleAvatarClick = () => {
        console.log('cliiiiiiicke', peerRef)
        createOffer(peerRef);
    };
    console.log(userCreated)
    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Col lg={12} md={16} xs={20} span={7} style={{marginTop: "4rem"}}>
                <Input
                    value={enteredUsername}
                    onChange={(e) => {
                        setEnteredUsername(e.target.value)
                    }}
                    style={{margin: '2rem 0'}}
                    onPressEnter={value => login(value)}
                    placeholder="Enter your username"
                    prefix={<Icon type={"user"} style={{color: 'rgba(0,0,0,.25)'}}/>}
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
                {userCreated && (
                    <Search
                        style={{marginBottom: '2rem'}}
                        placeholder="search for users"
                        onSearch={value => searchFun(value)}
                        enterButton
                    />
                )}

                <Row>
                    <Col lg={9} md={12} xs={15} offset={1} span={4}>
                        <Avatar
                            icon={storedUserSpec ? "user" : "qq"}
                            size={256}
                            alt="userName"
                        />
                        <div align="center">
                            <Descriptions title={storedUserSpec ? storedUserSpec["username"] : ""}/>
                        </div>
                    </Col>
                    <Col lg={9} md={12} xs={15} offset={4} span={4}>
                        <Avatar
                            onClick={handleAvatarClick}
                            icon={peer ? "up-square" : "qq"}
                            size={256}
                        />
                        <div align="center">
                            <Descriptions title={peer ? peer["username"] : ""}/>
                        </div>
                    </Col>
                </Row>
                {peer && (
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
                )}

            </Col>
        </div>
    )
};
export default Home