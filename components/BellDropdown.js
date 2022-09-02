import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "scss/components/BellDropdown.module.scss";
import Link from "next/link";
import { notificationsState } from "reduxState/slices/notificationsSlice";

const NotificationCard = ({ title, notify, link, id, user, setOn, getNotifications }) => {
  const handleClick = () => {
    setOn(false);
    const url = `/api/notifications`;
      axios.patch(url, {
          id,
          seen: true
        },
        {
        headers: {
          Authorization: `bearer ${user.token}`,
        }
      }).then(()=>{
        getNotifications();
      });
  }
  return (
    <div
      className={`${styles.notificationCard} ${notify ? styles.notify : ""}`}
    >
      <Link href={link ? link : "/order"}>
        <p className={`${styles.notificationTitle} white cursor-pointer`} onClick={handleClick}>{title}</p>
      </Link>
    </div>
  );
};

function BellDropdown(props) {
  const { ref, state } = props;
  const [isOn, setOn] = state;
  const [stateValue, stateSetter] = props.state;
  const user = useSelector((state) => state.authState);
  const { notifications } = useSelector((state) => state.notificationsState);
  const dispatch = useDispatch();

  const getNotifications = () => {
    const url = user.isAdmin ? `/api/notifications` : `api/notifications/${user.id}`;
    axios.get(url, {
        headers: {
          Authorization: `bearer ${user.token}`,
        }
      }).then(({data}) => {
        dispatch(notificationsState({notifications: data}));
      });
}
  useEffect(()=>{
    if (user.id) {
      getNotifications();
    }
  }, [user])

  return (
    <div
      className={`${styles.dropdown} ${stateValue ? styles.open : ""}`}
      ref={ref}
    >
      {notifications.map((noti) => {
        return <NotificationCard title={noti.message} link={noti.link} notify={true} key={noti._id} id={noti._id} user={user} setOn={setOn} getNotifications={getNotifications}/>
      })}
    </div>
  );
}

export default BellDropdown;
