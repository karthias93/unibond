import axios from "axios";
import OutsideClickDetector from "hooks/OutsideClickDetector";
import Link from "next/link";
import React, { forwardRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "scss/components/CommentsDropdown.module.scss";
import IconButton from "./IconButton";
import toast from "./Toast";

const UserCard = ({ img, title, notify, notficationCount, id }) => {
  return (
    <Link href={`/chat/${id}`}>
      <div className={`${styles.userCard} cursor-pointer`}>
        <IconButton img={img} notify={notify} profilePic={true} />
        <p className={`${styles.usercardTitle} white weight-7`}>{title}</p>
        {notficationCount ? (
          <p className={`${styles.commentNumber} gray weight-5`}>
            ({notficationCount})
          </p>
        ) : (
          ""
        )}
      </div>
    </Link>
  );
};

const CommentsDropdown = React.forwardRef((props, ref) => {
  const [stateValue, stateSetter] = props.state;
  const [users, setUsers] = useState([]);
  const currentUser = useSelector((state)=>state.authState);
  useEffect(()=>{
    if (currentUser.token) {
      axios
        .get(`/api/chat/history/${currentUser.id}`, {
          params: {
            table: currentUser.isAdmin ? 'users' : 'members'
          },
          headers: {
              Authorization: `bearer ${currentUser.token}`,
          },
        })
        .then(({ data }) => setUsers(data))
        .catch(({ request: { responseText } }) => toast({ type: "error", message: `${JSON.parse(responseText).message}` }));
    }
  }, [currentUser])
  return (
    <div
      className={`${styles.dropdown} ${stateValue ? styles.open : ""}`}
      ref={ref}
    >
      {users.map(user=>{
        return (<UserCard
          img={user?.profilePic?.url ? user.profilePic.url : `${process.env.imgUrlEndpoint}/profile-picture-default_x300PldEOA.png`}
          title={user.username}
          notify={true}
          notficationCount={3}
          key={user._id}
          id={user._id}
        />)
      })}
    </div>
  );
});

CommentsDropdown.displayName = "CommentsDropdown";

export default CommentsDropdown;
