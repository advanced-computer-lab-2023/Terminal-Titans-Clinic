import { useContext, useEffect, useRef, useState } from "react";
import Logo from "./Logo";
// import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "./Contact";

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000');
        ws.onopen = () => {
            ws.send(JSON.stringify({ token: sessionStorage.getItem('token') }));
        };
        setWs(ws);
        ws.addEventListener('message', handleMessage)

        (async () => {
            await axios.get('http://localhost:8000/security/profile', {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).then(response => {
                console.log(response.data.Result._id);
                setId(response.data.Result._id);
                setUsername(response.data.Result.Username);

            })();
        })
    }, []);

    async function showOnlinePeople(peopleArray) {
        let people = {};
        peopleArray.forEach(({ userId, username }) => {
            if (userId !== id && userId)
                people[userId] = username;
        });
        console.log({ people }, id);
        setOnlinePeople(people);
    }

    function handleMessage(ev) {
        const messageData = JSON.parse(ev.data);
        if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        }
    }

    // const onlinePeopleExclOurUser = { ...onlinePeople };
    // delete onlinePeopleExclOurUser[id];


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
                            onClick={() => { setSelectedUserId(userId); console.log({ userId }) }}
                            selected={userId === selectedUserId} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">
                    messages with seleted people
                </div>

                <form className="flex gap-2">
                    <input type="text"
                        placeholder="Type your message here"
                        className="bg-white flex-grow border rounded-sm p-2" />

                    <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}