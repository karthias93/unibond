import { useState, useEffect, useRef } from "react";
import styles from "scss/components/ChatScreen.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { formulateDate } from "utils/helpers/date/messageDate";
import { toggleState as toggleChatScreenState } from "reduxState/slices/chatModalSlice";
import { toggleState as toggleBlackScreenState } from "reduxState/slices/blackScreenSlice";
import { chatUser } from "../reduxState/slices/chatUserSlice";

function Messages({ messages, setMessages, socket, sender }) {
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const reciever = useSelector((state) => state.chatUserState);
    const [latestMessageSender, setLatestMessageSender] = useState();
    const dispatch = useDispatch();
    const chatUsers = useSelector((state) => state.usersState);
    const chatScreenState = useSelector((state) => state.chatScreenState);
    const chatUserRef = useRef();
    useEffect(() => { chatUserRef.current = chatUsers; }, [chatUsers]);
    const chatScreenStateRef = useRef();
    useEffect(() => { chatScreenStateRef.current = chatScreenState; }, [chatScreenState]);

    useEffect(() => {
        if (socket.current) {
            console.log('------');
            socket.current.on("msg-recieve", (id, msg, to, from, createdAt) => {
                setLatestMessageSender(from);
                setArrivalMessage({ sender: from, message: msg, createdAt, to, id });
                if (chatUserRef.current.users.length && from && !chatScreenStateRef.current.show) {
                    const index = chatUserRef.current.users.findIndex((user)=>user._id===from);
                    if (index !== -1) {
                        const { _id, email, username, status, skill } = chatUserRef.current.users[index];
                        dispatch(chatUser({ id: _id, email, username, status, skill }));
                        if (!window.location.href.includes(`chat`)) {
                            dispatch(toggleChatScreenState(true));
                            dispatch(toggleBlackScreenState(true));
                        }
                    }
                }
            });
        }
    }, [reciever, socket.current, dispatch]);

    useEffect(() => {
        if (latestMessageSender && reciever.id === latestMessageSender) {
            arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
            return;
        }
    }, [arrivalMessage, latestMessageSender, reciever, setMessages]);

    return (
        <>
            {messages?.map(({ message, sender: messageOwner, id, createdAt }) => (
                <div className={messageOwner !== sender?.id ? styles.recieved : styles.send} key={id}>
                    <span className={styles.chatProfilePicture}>
                        {messageOwner !== sender?.id ? reciever.username?.slice(0, 1).toUpperCase() : sender.username?.slice(0, 1).toUpperCase()}
                    </span>
                    <p>{message}</p>
                    <h6 className="fs-13px weight-4 white lh-1">{formulateDate(createdAt)}</h6>
                </div>
            ))}
        </>
    );
}

export default Messages;
