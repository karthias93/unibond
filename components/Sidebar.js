import React, { useEffect, useState } from "react";
import styles from "scss/components/Sidebar.module.scss";
import SidebarHeader from "./SidebarHeader";
import { AiOutlineSearch } from "react-icons/ai";
import UserCard from "./UserCard";
import MetaMaskDetails from "./MetaMaskDetails";
import { chatUser } from "../reduxState/slices/chatUserSlice";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "./ChatModal";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { usersState } from "reduxState/slices/usersSlice";
let updatesStatuses;

function Sidebar({ pageName }) {
    const { users } = useSelector((state) => state.usersState);
    const [updatedUsers, setUpdatedUsers] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [updatedStatus, setUpdatedStatus] = useState({
        userIDs: "",
    });
    const reciever = useSelector((state) => state.chatUserState);
    const { isAdmin } = useSelector((state)=> state.authState);
    const dispatch = useDispatch();

    useEffect(() => {
        if (socket.current) {
            socket.current.on("online-user", (onlineUser) => {
                setUpdatedStatus({ userIDs: new Map(Object.entries(onlineUser)) });
            });
        }
    }, [pageName]);

    useEffect(() => {
        const { userIDs } = updatedStatus;
        if (userIDs.size) {
            updatesStatuses = users?.map((user) => {
                if (userIDs?.get(user._id)) return { ...user, status: true };
                else return { ...user, status: false };
            });
            setUpdatedUsers(updatesStatuses);
            if (reciever.id) {
                if (userIDs?.get(reciever.id)) dispatch(chatUser({ ...reciever, status: true }));
                else dispatch(chatUser({ ...reciever, status: false }));
            }
        }
        setUpdatedUsers(updatesStatuses);
    }, [dispatch, reciever, updatedStatus, users]);

    const fetchMoreData = () => {
        if (isAdmin) {
            axios.get(`${process.env.apiUrl}/api/users?skip=${updatedUsers.length}`).then(({ data }) => {
                if (data.length) {
                    dispatch(usersState({users: users.concat(data)}));
                } else {
                    setHasMore(false);
                }   
            });
        } else {
            setHasMore(false)
        }
    }

    return (
        <div className={styles.sidebar}>
            <div className={`${styles.container}`}>
                <SidebarHeader />
            </div>

            <div className={styles.usersCardsWrapper}>
                <div className={styles.container2}>
                    <header className={styles.userHeader}>
                        <h1 className="fs-30px black weight-7 lh-1">Live Now</h1>
                        <button>
                            <AiOutlineSearch size={24} className="gray" />
                        </button>
                    </header>
                </div>
                <main className={styles.usersCards}>
                <InfiniteScroll
                    dataLength={updatedUsers?.length ? updatedUsers.length : 0}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    height='calc(40vh)'
                    >
                    {updatedUsers?.map(({ username, _id, email, skill, status, profilePic }) => (
                        <UserCard name={username} skill={skill} id={_id} key={_id} email={email} status={status} profilePic={profilePic} />
                    ))}
                </InfiniteScroll>
                </main>
            </div>

            <div className={styles.container}>
                <MetaMaskDetails />
            </div>
        </div>
    );
}

export default Sidebar;
