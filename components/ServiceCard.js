import useMediaQuery from "hooks/useMediaQuery";
import { IKImage } from "imagekitio-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "scss/components/ServiceCard.module.scss";
import { toggleState as toggleLoaderState } from "reduxState/slices/loaderSlice";
import axios from "axios";
import { isMember } from "../utils/helpers/member";
import toast from "./Toast";

const SkillCard = ({ text }) => {
    return <div className={`${styles.skillCard} gray fs-8px weight-6`}>{text}</div>;
};

function ServiceCard({ title, icon, iconClass = "two", fontSize = "fs-30px", id }) {
    const isBellow760px = useMediaQuery("(max-width : 47.5em)");
    const { isDark } = useSelector((state) => state.themeState);
    const currentUser = useSelector((state)=>state.authState);

    const [member, setMember] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser) {
            setMember(isMember(currentUser.email));
        }
    }, [currentUser]);

    const placeOrder = () => {
        if (currentUser.token) {
            dispatch(toggleLoaderState(true));
            axios
                .post(`/api/orders`, {
                    service: id,
                    user: currentUser.id,
                    email: currentUser.email,
                    name: currentUser.username,
                    serviceName: title
                },{
                    headers: {
                        Authorization: `bearer ${currentUser.token}`,
                    },
                })
                .then(() => {
                    toast({ type: "success", message: 'Order placed successfully' });
                    dispatch(toggleLoaderState(false));
                })
                .catch(({ request: { responseText } }) => {
                    toast({ type: "error", message: `${JSON.parse(responseText).message}` });
                    dispatch(toggleLoaderState(false));
                });
        }
    }

    return (
        <div className={`${styles.card} ${isDark ? styles.dark : ""}`}>
            <IKImage path="images/triangleBlob.png" className={styles.blob} loading="lazy" lqip={{ active: true }} alt="" />
            <h1 className={`${isBellow760px ? "fs-20px" : "fs-30px"} weight-8 black ${styles.title}`}>{title}</h1>

            <div className={styles.skills}>
                <SkillCard text="Focused Designs" />
                <SkillCard text="Experienced Team" />
                <SkillCard text="User Research" />
            </div>

            <IKImage path={icon} className={`${iconClass} ${styles.card_img}`} loading="lazy" lqip={{ active: true }} alt="" />
            <button className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 fs-10px my-2 rounded ${styles.orderNow}`} type="button" onClick={placeOrder} disabled={member}>Order Now</button>
        </div>
    );
}

export default ServiceCard;
