import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"
import "../Styles/room.css"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo, faPhoneSlash, faMicrophone, faVideoSlash, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'

// const socket = io('http://localhost:5000')
//connet to the socket
const socket = io('http://localhost:8000');
socket.on('connect', () => {
    console.log('Connected to server');
});
console.log('socket', socket);
function Room() {
    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState("")
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState("")
    const [videoButton, setVideoButton] = useState(true)
    const [micButton, setMicButton] = useState(true)
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            if (myVideo.current)
                myVideo.current.srcObject = stream
        })

        socket.on("me", (id) => {
            setMe(id)
        })

        socket.on("callUser", (data) => {
            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
        })
    }, [])

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            })
        })
        peer.on("stream", (stream) => {

            userVideo.current.srcObject = stream

        })

        peer.on('close', () => {
            setCallEnded(true)
            connectionRef.current.destroy()
        })

        socket.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall = () => {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })

        peer.on('close', () => {
            setCallEnded(true)
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        if(connectionRef.current)
            connectionRef.current.destroy()
    }

    const closeVideo = () => {
        const enabled = stream.getVideoTracks()[0].enabled;
        if (enabled) {
            stream.getVideoTracks()[0].enabled = false;
            setVideoButton(false);
        } else {
            stream.getVideoTracks()[0].enabled = true;
            setVideoButton(true);
        }
    }

    const closeMic = () => {
        const enabled = stream.getAudioTracks()[0].enabled;
        if (enabled) {
            stream.getAudioTracks()[0].enabled = false;
            setMicButton(false);
        } else {
            stream.getAudioTracks()[0].enabled = true;
            setMicButton(true);
        }
    }

    return (
        <>
            <div id="videos">
                {/* <video className="video-player" id="user-1" autoplay playsinline></video> */}
                <div className="video-player">
                    {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                </div>
                <div className="video-player" id="user-2">
                    {callAccepted && !callEnded ?

                        <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} /> :
                        null}
                </div>
                {/* <video className="video-player" id="user-2" autoplay playsinline></video> */}
            </div>

            <div id="controls">

                <div class="control-container" id="camera-btn" onClick={closeVideo}>
                    {videoButton ? <FontAwesomeIcon icon={faVideo} /> : <FontAwesomeIcon icon={faVideoSlash} />}
                </div>

                <div class="control-container" id="mic-btn" onClick={closeMic}>
                    {micButton ? <FontAwesomeIcon icon={faMicrophone} /> : <FontAwesomeIcon icon={faMicrophoneSlash} />}
                </div>

                {/* <a href="lobby.html"> */}
                    <div class="control-container" id="leave-btn">
                        <FontAwesomeIcon icon={faPhoneSlash} onClick={leaveCall} />
                    </div>
                {/* </a> */}

            </div>

            {/* <h1 style={{ textAlign: "center", color: '#fff' }}>Zoomish</h1>
			<div className="container">
				<div className="video-container">
					<div className="video">
						{stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
					</div>
					<div className="video">
						{callAccepted && !callEnded ?
							<video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} /> :
							null}
					</div>
				</div>
				<div className="myId">
					<textarea
						id="filled-basic"
						label="Name"
						variant="filled"
						value={name}
						onChange={(e) => setName(e.target.value)}
						style={{ marginBottom: "20px" }}
					/>
					<CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
						<button variant="contained" color="primary">
							Copy ID
						</button>
					</CopyToClipboard>

					<textarea
						id="filled-basic"
						label="ID to call"
						variant="filled"
						value={idToCall}
						onChange={(e) => setIdToCall(e.target.value)}
					/>
					<div className="call-button">
						{callAccepted && !callEnded ? (
							<button variant="contained" color="secondary" onClick={leaveCall}>
								End Call
							</button>
						) : (
							<button color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
								phone
							</button>
						)}
						{idToCall}
					</div>
				</div>
				<div>
					{receivingCall && !callAccepted ? (
						<div className="caller">
							<h1 >{name} is calling...</h1>
							<button variant="contained" color="primary" onClick={answerCall}>
								Answer
							</button>
						</div>
					) : null}
				</div>
			</div> */}
        </>
    )
}

export default Room;