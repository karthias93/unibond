import axios from "axios";
import ServiceCard from "components/ServiceCard";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { servicesState } from "reduxState/slices/servicesSlice";
import styles from "scss/layout/Services.module.scss";

function Services() {
    const dispatch = useDispatch();
    const { services } = useSelector((state)=>state.servicesState);

    useEffect(()=>{
        axios.get(`/api/services`)
            .then(({data})=>{
                dispatch(servicesState({ services: data }));
            });
    }, [dispatch])
    return (
        <div className={styles.wrapper}>
            {services.map((service, index)=>{
                return <ServiceCard title={service.title} icon={`icons/${service.icon}`} iconClass={`${styles.icon} ${styles[`icon${index+1}`]}`} id={service._id} key={service._id}/>
            })}
        </div>
    );
}

export default Services;
