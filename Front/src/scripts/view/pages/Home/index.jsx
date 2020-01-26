import React, {useEffect, useState, useRef} from 'react';
import { connect } from 'react-redux';
import {Input, Icon, Tooltip, Col, Upload, message, Button, Avatar, Divider, Row, Descriptions} from 'antd';
import uuid from 'uuid/v1'
import {databaseRef} from "../../../core/webrtc/firebase";
import {
    createOffer,
    onopen,
    handleOffer,
    handleAnswer,
    sendMessage,
    handleCandidate
} from "../../../core/webrtc/web-rtc";

const {Search} = Input;


const {Dragger} = Upload;

const props = {
    name: 'file',
    multiple: true,
    action: (file) => {
        const fileInfo = {
            type: 'file-info',
            data: {
                type: file.type,
                size: file.size,
                name: file.name    
            }
        }
        sendMessage(fileInfo);
    },
    // onChange(info) {
    //     const {status} = info.file;
    //     console.log(info)
    //     // if (status !== 'uploading') {
    //     //     console.log(info.file, info.fileList);
    //     // }
    //     // if (status === 'done') {
    //     //     message.success(`${info.file.name} file uploaded successfully.`);
    //     // } else if (status === 'error') {
    //     //     message.error(`${info.file.name} file upload failed.`);
    //     // }
    // },
};


const Home = ({status}) => {
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
        storedUserRoomRef,
        peerRef,
        peer
    }
    useEffect(() => {
        return () => {
            ref.current.storedUser.remove();
            ref.current.storedUserRoomRef.remove();
            databaseRef.child(`/candidates/${enteredUsername}`).remove();
            databaseRef.child(`/offers/${enteredUsername}`).remove();
            databaseRef.child(`/answers/${enteredUsername}`).remove();
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
        console.log(`creating room for username: ${username}`);
        const roomRef = databaseRef.child(`rooms/${username}`);
        const userRoomRef = roomRef.child(`users/${username}`);
        roomRef.set({
            room_id: username,
        }, (e) => {
            if (e === null) {
                setRoomCreated(true);
            } else {
                console.log(`creating room error: ${e}`);
                return false;
            }
        });
        userRoomRef.set(user, (e) => console.log(`creating user error: ${e}`));
        roomChange(roomRef);

        onOfferReceived();
        onAnswerRecieved();
        onCandidateRecieve();

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
        console.log('Started tracking room changes')
        roomRef.on('value', (snapshot) => {
            console.log('New Change on room with:', snapshot.val())
            if (snapshot.val() !== null) {
                const users = snapshot.val().users !== null ? snapshot.val().users : undefined;
                console.log('Users of the Snapshot: ', users);
                if (users && Object.keys(users).length > 1 && !peerCreated) {
                    Object.keys(users).map((username) => {
                        if (username !== enteredUsername) {
                            console.log(`Identified a new peer with username: ${username}`)
                            const newPeer = users[username]
                            setPeer(newPeer)
                            setPeerRef(roomRef.child(`users/${username}`))
                            setPeerCreated(true)
                        }
                    })
                }
            }
        })
    }
    const onOfferReceived = () => {
        console.log('Started receiving offers');
        databaseRef.child(`/offers/${enteredUsername}`).on('child_added', (data) => {
            console.log("new offer received: ", data.val())
            console.log("offer from: ", data.key)
            const answerRef = databaseRef.child(`/answers/${data.key}/${enteredUsername}`)
            handleOffer(data.val().offer, answerRef)
        })
    }
    const onAnswerRecieved = () => {
        console.log('Started receiving answers');
        databaseRef.child(`/answers/${enteredUsername}`).on('child_added', (data) => {
            console.log("new answer received:", data.val())
            console.log("answer from", data.key)
            handleAnswer(data.val().answer, data.key)
        })
    }
    const onCandidateRecieve = () => {
        console.log('Started receiving candidates');
        databaseRef.child(`/candidates/${enteredUsername}`).on('child_added', (data) => {
            console.log("new candidate received:", data.val())
            console.log("candidate from", data.key)
            handleCandidate(data.val())
        })
    }
    const searchFun = (value) => {
        const roomRef = databaseRef.child(`/rooms/${value}`);
        roomRef.on('value', (roomSnapshot) => {
            if (roomSnapshot === null) {
                console.log('room does not exist');
                return
            }
            const users = roomSnapshot.val() !== null ? roomSnapshot.val().users : undefined;
            if (users && Object.keys(users).length === 1) {
                setPeer(users[Object.keys(users)[0]]);
                setPeerRef(roomRef.child(`/users/${value}`))
            }
            const userRef = databaseRef.child(`/users/${value}`);
            userRef.once('value', (userSnapShot) => {
                if (userSnapShot === null) {
                    console.log('user does not exist');
                    return
                }

                roomRef.child(`users/${enteredUsername}`).set(storedUserSpec, (e) => {
                    if (e === null) {
                        console.log('user added to room');
                    } else {
                        console.log(`error adding to room: ${e}`);
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
        console.log('Clicked on peer');
        console.log('Connecting to peer');
        const offerRef = databaseRef.child(`/offers/${peer["username"]}/${enteredUsername}`)
        createOffer(offerRef);
    };

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
                    <Col span={12}  style={{textAlign: 'center'}}>
                        <Avatar
                            icon={storedUserSpec ? "user" : "qq"}
                            alt="userName"
                            size={150}
                        />
                        <div align="center">
                            <Descriptions title={storedUserSpec ? storedUserSpec["username"] : ""}/>
                        </div>
                        <div align="center">
                            <div>
                                {status !== null ? status : ''}
                            </div>
                        </div>

                    </Col>
                    <Col span={12} style={{textAlign: 'center'}}>
                        <Avatar
                            onClick={handleAvatarClick}
                            icon={peer ? "up-square" : "qq"}
                            size={150}
                        />
                        <div align="center">
                            <Descriptions title={peer ? peer["username"] : ""}/>
                        </div>
                    </Col>
                </Row>
                {peer && (
                    <Dragger {...props} height={200}>
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
            <Button
                onClick={() => {
                    sendMessage('hello from the other side');
                }}
            >
                Send Some Shit
            </Button>
        </div>
    )
};

const mapStateToProps = state => {
    console.log('sssssssssssssssssssssssssssssssssssss', state.webrtc.status)
    return {
        status: state.webrtc.status
    }
}
export default connect(mapStateToProps)(Home)