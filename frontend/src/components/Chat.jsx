import { useContext, useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { set, uniqBy } from "lodash";
import axios from "axios";
import Contact from "./Contact";
import { io } from 'socket.io-client';
import { useNavigate, createSearchParams } from "react-router-dom";
import Peer from "simple-peer"
import chat from '../Styles/Chat.css';
import { useLocation } from 'react-router-dom';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


export default function Chat() {
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [name, setName] = useState("")
    const [me, setMe] = useState("")


    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [selectedUserType, setSelectedUserType] = useState(null);
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const [offlinePeople, setOfflinePeople] = useState({});
    const [socket, setSocket] = useState(null);
    const [video, setVideo] = useState(false);
    const [type, setType] = useState('');
    const divUnderMessages = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(window.location.search);
    const url = window.location.href;
    const token = url.split('/chat/')[1];
    // console.log(chatId)
    //const token = params.get('token');
    // const token = new window.URLSearchParams("token");
    sessionStorage.setItem("token", token);


    useEffect(() => {
        connectToWs()
        let socket = io('http://localhost:8000', {
            auth: {
                Authorization: "Bearer " + sessionStorage.getItem('token')
            }
        });
        setSocket(socket);
        socket.on("me", (id) => {
            console.log('me', id);
            setMe(id)
        })
        socket.on("callUser", (data) => {
            console.log('calluser fy chat');
            console.log(data);
            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setVideo(data.video)
            setCallerSignal(data.signal)
        })
        socket.on("rejected", (data) => {
            console.log(`Call rejected by user ${data.from}`);
            socket.emit("rejectCall", { to: data.from })
            // Handle the rejection as needed
            // For example, update the UI or show a notification
        });
    }, []);

    function connectToWs() {
        const ws = new WebSocket('ws://localhost:8000');
        ws.onopen = () => {
            ws.send(JSON.stringify({ token: sessionStorage.getItem('token') }));
        };
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('Disconnected. Trying to reconnect.');
                connectToWs();
            }, 1000);
        });
    }

    useEffect(() => {
        const div = divUnderMessages.current;
        if (div) {
            div.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages]);

    async function showOnlinePeople(peopleArray) {
        await axios.get('http://localhost:8000/people', {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            console.log(response.data.myUser.__t);
            setType(response.data.myUser.__t)
            setId(response.data.myUser._id);
            setUsername(response.data.myUser.Username);
            let onlinePeople = {};

            for (let i = 0; i < response.data.Result.length; i++) {
                for (let j = 0; j < peopleArray.length; j++) {
                    if (response.data.Result[i]._id == peopleArray[j].userId) {
                        onlinePeople[response.data.Result[i]._id] = [response.data.Result[i].Username, response.data.Result[i].__t];
                    }
                }
            }
            const offlinePeopleArr = response.data.Result
                .filter(p => p._id != id)
                .filter(p => !Object.keys(onlinePeople).includes(p._id));
            const offlinePeople = {};
            offlinePeopleArr.forEach(p => {
                offlinePeople[p._id] = p;
            });
            setOfflinePeople(offlinePeople);
            console.log(offlinePeople);
            console.log(onlinePeople);
            setOnlinePeople(onlinePeople);
        });
    }

    useEffect(() => {
        if (selectedUserId) {
            axios.get('http://localhost:8000/messages/' + selectedUserId, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(res => {
                setMessages(res.data);
            });
        }
    }, [selectedUserId]);

    async function sendMessage(ev, file = null) {
        if (ev) ev.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText,
            //   file,
        }));
        if (file) {
            await axios.get('http://localhost:8000/messages' + selectedUserId, {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(res => {
                setMessages(res.data);
            });
        } else {
            setNewMessageText('');
            setMessages(prev => ([...prev, {
                text: newMessageText,
                sender: id,
                recipient: selectedUserId,
                _id: Date.now(),
            }]));
        }
    }

    function handleMessage(ev) {
        const messageData = JSON.parse(ev.data);
        if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        } else if ('text' in messageData) {
            console.log(messageData.sender.toString());
            console.log(selectedUserId);
            console.log(sessionStorage.getItem('selectedUserId'));
            console.log(messageData.sender.toString() == sessionStorage.getItem('selectedUserId'));
            console.log(messageData.sender.toString() == selectedUserId);
            if (messageData.sender.toString() == sessionStorage.getItem('selectedUserId')) {
                setMessages(prev => ([...prev, { ...messageData }]));
            }
        }
    }

    // const onlinePeopleExclOurUser = { ...onlinePeople }
    // delete onlinePeopleExclOurUser[id];

    const messagesWithoutDupes = uniqBy(messages, '_id');

    const answerCall = () => {
        navigate('/meeting', {
            state: {
                video: video,
                recipient: selectedUserId,
                answerCall: true,
                callerUser: caller,
                callerUserSignal: callerSignal,
            }
        });
    }

    function rejectCall() {
        setReceivingCall(false)
        socket.emit("rejected", { to: caller })
    }

    function startCall() {
        // ws.send(JSON.stringify({
        //     call: true,
        //     recipient: selectedUserId,
        // }));
        console.log('me', me);
        console.log('username', username);
        navigate('/meeting', {
            state: {
                video: false,
                recipient: selectedUserId,
                answerCall: false,
                me: me,
                userName: username,
                callerUser: caller,
                callerUserSignal: callerSignal,
            }
        });
    }

    function startVideoCall() {
        navigate('/meeting', {
            state: {
                video: true,
                recipient: selectedUserId,
                answerCall: false,
                me: me,
                userName: username,
                callerUser: caller,
                callerUserSignal: callerSignal,
            }
        });
    }

    function goToHome() {
        if (type == 'Pharmacist') {
            window.location.href = 'http://localhost:4000/Health-Plus/pharmacistScreen';
        }
        else if (type == 'patient') {
            window.location.href = 'http://localhost:3000/Health-Plus/patientHome';
        }
        else if (type == 'Doctor') {
            window.location.href = 'http://localhost:3000/Health-Plus/doctorHome';
        }
    }

    return (
        <div className="flex h-screen">
            <div>
                {receivingCall ? (
                    <>
                        <div className="callingUser">
                            <div>
                                <h1 className="text-center">{name}</h1>
                                <p className="text-center">...is Calling</p>
                            </div>
                            <div className="optionsCall">
                                <i onClick={answerCall} style={{ background: 'green' }}>
                                    {<CallIcon />}
                                </i>
                                <i onClick={rejectCall} style={{ background: 'red' }}>
                                    {<CallEndIcon />}
                                </i>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
            <div className="bg-white w-1/3 flex flex-col">
                <div className="flex-grow">
                    <div style={{display:'flex'}}>
                {/* <Button
              // hena link el chatting
              style={{ color: 'black' }}
              onClick={() => { navigate(-1) }}
              sx={{ my: 1, mx: 0,marginRight:'-30px' }}
              size="small"
            >
              <ArrowBackIosIcon />

            </Button> */}
                    <div onClick={goToHome} className="logo">
                        <Logo />
                    </div>
                    </div>
                    {Object.keys(onlinePeople).map(userId => (
                        <Contact
                            key={userId}
                            id={userId}
                            online={true}
                            username={onlinePeople[userId][0]}
                            onClick={() => {
                                setSelectedUserId(userId); setSelectedUserName(onlinePeople[userId][0]);
                                setSelectedUserType(onlinePeople[userId][1]); console.log(selectedUserId);
                                sessionStorage.setItem('selectedUserId', userId);
                            }}
                            selected={userId === selectedUserId}
                            inChat={true}
                        />
                    ))}
                    {Object.keys(offlinePeople).map(userId => (
                        <Contact
                            key={userId}
                            id={userId}
                            online={false}
                            username={offlinePeople[userId].Username}
                            onClick={() => {
                                setSelectedUserId(userId); setSelectedUserName(offlinePeople[userId]?.Username);
                                setSelectedUserType(offlinePeople[userId]?.__t); console.log(userId);
                                sessionStorage.setItem('selectedUserId', userId);
                                console.log(selectedUserId);
                            }}
                            selected={userId === selectedUserId}
                            inChat={true} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2 relative">
                {!!selectedUserId && (
                    <div className="callNav">
                        <Contact
                            id={selectedUserId}
                            online={false}
                            username={selectedUserName}
                            selected={false}
                            inChat={false} />
                        {type !== 'Pharmacist' && selectedUserType !== 'Pharmacist' ?
                            <div className="callIcons">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" onClick={startCall}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" onClick={startVideoCall}>
                                    <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                            : null}
                    </div>
                )}
                <div className="flex-grow">
                    <div className="spaceTop"></div>
                    {!selectedUserId && (
                        <div className="flex h-full flex-grow items-center justify-center">
                            <div className="text-gray-300">&larr; Select a person from the sidebar</div>
                        </div>
                    )}
                    {!!selectedUserId && (
                        <div className="relative h-full">
                            <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                                {messagesWithoutDupes.map(message => (
                                    <div key={message._id} className={(message.sender === id ? 'text-right' : 'text-left')}>
                                        <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " + (message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500')}>
                                            {message.text}
                                            {message.file && (
                                                <div className="">
                                                    <a target="_blank" className="flex items-center gap-1 border-b" href={axios.defaults.baseURL + '/uploads/' + message.file}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                            <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                                                        </svg>
                                                        {message.file}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={divUnderMessages}></div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="spaceTop"></div>
                {!!selectedUserId && (
                    <form className="flex gap-2" onSubmit={sendMessage}>
                        <input type="text"
                            value={newMessageText}
                            onChange={ev => setNewMessageText(ev.target.value)}
                            placeholder="Type your message here"
                            className="bg-white flex-grow border rounded-sm p-2 z-1" />
                        <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm z-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}