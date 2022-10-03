import React, { useState, useEffect, useMemo, useRef } from "react";
import styles from "scss/components/ChatScreen.module.scss";
import { useSelector, useDispatch } from "react-redux";
import Messages from "./Messages";
import { toCapital } from "../utils/helpers/toCapital";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import toast from "./Toast";
import { socket } from "components/ChatModal";
import { useRouter } from 'next/router';
import { chatUser } from "../reduxState/slices/chatUserSlice";
import { IKImage } from "imagekitio-react";

function ChatScreen() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const sender = useSelector((state) => state.authState);
    const reciever = useSelector((state) => state.chatUserState);
    const chatUsers = useSelector((state) => state.usersState);
    const router = useRouter()
    const { id } = router.query;
    const dispatch = useDispatch();

    const headersConfig = useMemo(() => {
        return {
            headers: {
                Authorization: `bearer ${sender.token}`,
            },
        };
    }, [sender.token]);

    useEffect(() => {
        if (chatUsers.users.length && id) {
            const index = chatUsers.users.findIndex((user) => user._id === id);
            if (index !== -1) {
                const { _id, email, username, status, skill, profilePic } = chatUsers.users[index];
                dispatch(chatUser({ id: _id, email, username, status, skill, profilePic }));
            }
        }
    }, [id, chatUsers.users, dispatch])

    useEffect(() => {
        setMessages([]);
        if (sender.id && reciever.id) {
            axios
                .get(`/api/chat/${sender.id}/${reciever.id}`, headersConfig)
                .then(({ data }) => setMessages(data))
                .catch(({ request: { responseText } }) => toast({ type: "error", message: `${JSON.parse(responseText).message}` }));
        }
    }, [reciever.id, sender.id, sender.token, headersConfig]);

    useEffect(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        setMessage("");
    }, [reciever]);

    const sendMessage = async (e, type) => {
        if ((type && message) || (e.key === "Enter" && message)) {
            axios
                .post(
                    "/api/chat/addMessage",
                    {
                        from: sender.id,
                        to: reciever.id,
                        message,
                    },
                    headersConfig
                )
                .then(({ data }) => {
                    setMessage("");
                    socket.current.emit("send-msg", {
                        id: data.id,
                        to: reciever.id,
                        from: sender.id,
                        message,
                        createdAt: Date.now(),
                    });
                    const msgs = [...messages];
                    msgs.push({ sender: sender.id, message: message, createdAt: Date.now() });
                    setMessages(msgs);
                })
                .catch(({ request: { responseText } }) => toast({ type: "error", message: `${JSON.parse(responseText).message}` }));
        }
    };

    return (
        <div className={`${styles.screen} ${styles.chatScreen}`}>
            <div className="flex">
                <div className={styles.userInfo}>
                    {reciever.profilePic?.url ?
                        (<IKImage src={reciever.profilePic.url} alt="" loading="lazy" lqip={{ active: true }} className={styles['profile-pic']} />) : (
                            <div className={`${styles.profilePicture} ${styles.chatFull}`}>
                                {reciever.username?.slice(0, 1).toUpperCase()}
                            </div>
                        )}
                    <div>
                        <h2 className="fs-30px weight-7 black mb-5px lh-1">{toCapital(reciever?.username)}</h2>
                        <p className="fs-16px text-[#363636] weight-6 lh-1 mt-3">{reciever?.skill || "User"}</p>
                        <div className="fs-14px text-[#363636] weight-4 lh-1 flex mt-3"><div className={`mr-2 ${reciever?.status ? styles.onlineCircle : styles.offlineCircle}`}></div> {reciever?.status ? 'Online' : 'Offline'}</div>
                    </div>
                </div>
                <div className="w-9/12">
                    <div className={`${styles.messagesWrapper}`} ref={scrollRef}>
                        <Messages messages={messages} socket={socket} setMessages={setMessages} sender={sender} />
                    </div>
                    <div className={styles.chatInput}>
                        <input
                            placeholder="Enter Message"
                            className="fs-16px black weight-5"
                            value={message}
                            onKeyPress={sendMessage}
                            onChange={(e) => setMessage(e.target.value)}
                        ></input>

                        <icon onClick={(e) => sendMessage(e, "click")}>
                            <IoMdSend color="white" size={22} className="ml-auto" />
                        </icon>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatScreen;
