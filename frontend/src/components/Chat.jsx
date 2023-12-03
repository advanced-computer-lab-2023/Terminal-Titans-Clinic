import { useContext, useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "./Contact";
import { io } from 'socket.io-client';
import { useNavigate, createSearchParams } from "react-router-dom";
import Peer from "simple-peer"
import chat from '../Styles/Chat.css';


export default function Chat() {
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [name, setName] = useState("")
    const [me, setMe] = useState("")


    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const [offlinePeople, setOfflinePeople] = useState({});
    const divUnderMessages = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        connectToWs()
        const socket = io('http://localhost:8000', {
            auth: {
                Authorization: "Bearer " + sessionStorage.getItem('token')
            }
        });
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
            setCallerSignal(data.signal)
        })
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
            setId(response.data.myUser._id);
            setUsername(response.data.myUser.Username);
            let onlinePeople = {};

            for (let i = 0; i < response.data.Result.length; i++) {
                for (let j = 0; j < peopleArray.length; j++) {
                    if (response.data.Result[i]._id == peopleArray[j].userId) {
                        onlinePeople[response.data.Result[i]._id] = response.data.Result[i].Username;
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
            console.log(messageData.sender.toString() == selectedUserId);
            // if (messageData.sender.toString() == selectedUserId) {
            setMessages(prev => ([...prev, { ...messageData }]));
            // }
        }
    }

    // const onlinePeopleExclOurUser = { ...onlinePeople }
    // delete onlinePeopleExclOurUser[id];

    const messagesWithoutDupes = uniqBy(messages, '_id');

    const answerCall = () => {
        navigate('/meeting', {
            state: {
                video: true,
                recipient: selectedUserId,
                answerCall: true,
                callerUser: caller,
                callerUserSignal: callerSignal,
            }
        });
        // navigate({
        //     pathname: "/meeting",
        //     search: createSearchParams({
        //         video: true,
        //         recipient: selectedUserId,
        //         answerCall: true,
        //         callerUser: caller,
        //         callerUserSignal: callerSignal,
        //     }).toString()
        // });
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
        console.log('username', username);
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

    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/3 flex flex-col">
                <div className="flex-grow">
                    <Logo />
                    {Object.keys(onlinePeople).map(userId => (
                        <Contact
                            key={userId}
                            id={userId}
                            online={true}
                            username={onlinePeople[userId]}
                            onClick={() => { setSelectedUserId(userId); }}
                            selected={userId === selectedUserId} />
                    ))}
                    {Object.keys(offlinePeople).map(userId => (
                        <Contact
                            key={userId}
                            id={userId}
                            online={false}
                            username={offlinePeople[userId].Username}
                            onClick={() => setSelectedUserId(userId)}
                            selected={userId === selectedUserId} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2 relative">
                {!!selectedUserId && (
                    <div className="callIcons">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6" onClick={startCall}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6" onClick={startVideoCall}>
                            <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                )}
                <div className="flex-grow">
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
                {!!selectedUserId && (
                    <form className="flex gap-2" onSubmit={sendMessage}>
                        <input type="text"
                            value={newMessageText}
                            onChange={ev => setNewMessageText(ev.target.value)}
                            placeholder="Type your message here"
                            className="bg-white flex-grow border rounded-sm p-2" />
                        <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}

                <div>
                    {receivingCall ? (
                        <div className="caller">
                            {/* <h1 >{name} is calling...</h1> */}
                            <button variant="contained" color="primary" onClick={answerCall}>
                                Answer
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}