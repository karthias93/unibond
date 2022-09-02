import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notificationsState } from "reduxState/slices/notificationsSlice";
import styles from "scss/components/BellDropdown.module.scss";
import Link from "next/link";

const NotificationCard = ({ title, notify, link }) => {
  return (
    <div
      className={`${styles.notificationCard} ${notify ? styles.notify : ""}`}
    >
      <Link href={link ? link : "/order"}>
        <p className={`${styles.notificationTitle} white`}>{title}</p>
      </Link>
    </div>
  );
};

function BellDropdown(props) {
  const { ref } = props;
  const [stateValue, stateSetter] = props.state;
  const user = useSelector((state) => state.authState);
  const { notifications } = useSelector((state) => state.notificationsState);
  const dispatch = useDispatch();

  useEffect(()=>{
    if (user.id) {
      const url = user.isAdmin ? `/api/notifications` : `api/notifications/${user.id}`;
      axios.get(url, {
        headers: {
          Authorization: `bearer ${user.token}`,
        }
      }).then(({data}) => {
        dispatch(notificationsState({notifications: data}));
      });
    }
  }, [user])

  return (
    <div
      className={`${styles.dropdown} ${stateValue ? styles.open : ""}`}
      ref={ref}
    >
      {notifications.map((noti) => {
        return <NotificationCard title={noti.message} link={noti.link} notify={true} key={noti._id} />
      })}
    </div>
  );
}

export default BellDropdown;
