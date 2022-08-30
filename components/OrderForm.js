import React, {Fragment, useEffect, useState} from "react";
import styles from "scss/components/UserProfile.module.scss";
import toast from "./Toast";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faCamera } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { isMember } from "../utils/helpers/member";
import axios from "axios";
import { auth as authState } from "reduxState/slices/authSlice";

library.add(fab);

const OrderFormSchema = Yup.object().shape({
    fullName: Yup.string().required('Name is required'),
    service: Yup.string().required('Service is required'),
    email: Yup.string().email().required("Email is required"),
    telegram: Yup.string().required("Telegram id  is required"),
    phone: Yup.string().required('mobile number is required')
});

function OrderForm() {
    const dispatch = useDispatch();
    const [accountOpen, setAccountOpen] = useState(false);
    const [emailNotification, setEmailNotification] = useState(false);
    const user = useSelector((state)=> state.authState);

    const updateUser = (values) => {
        axios
            .patch(`/api/users`, {
                ...values,
                id: user.id
            })
            .then((res) => {
                dispatch(authState({
                    ...user,
                    ...res.data
                }));
                localStorage.setItem("currentUser", JSON.stringify({
                    ...user,
                    ...res.data
                }));
                toast({ type: "success", message: `updated successfully` });
            })
            .catch(({ request: { responseText } }) => toast({ type: "error", message: `${JSON.parse(responseText).message}` }));
    }
    const submitHandler = async (values) => {
        const member = isMember(values.email);
        if (member) toast({ type: "warning", message: `Member don't have access to modify information` });
        else {
            updateUser(values);
        }
    };

    return (
        <div>
            <h3 className={styles.heading}>Order Form</h3>
            <div className={styles.formContainer}>
                <Formik
                    initialValues={{
                        fullName: '',
                        email: '',
                        phone:  '',
                        service: '',
                        telegram: ''
                    }}
                    validationSchema={OrderFormSchema}
                    onSubmit={(values) => {
                        submitHandler(values);
                    }}
                >
                    {(formik) => {
                        const { errors, touched, isValid, dirty } = formik;
                        return (
                            <Form>
                                <div className={styles.inputsContainer}>
                                    <div>
                                        <label className={styles.label} htmlFor="fullName">Full Name</label>
                                        <Field type="text" name="fullName" className={`${errors.fullName && touched.fullName ? 
                                            styles['input-error'] : null} ${styles.input}`} id="fullName" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className={styles.label} htmlFor="phoneNumber">Phone Number</label>
                                        <Field type="text" className={`${errors.phone && touched.phone ? 
                                            styles['input-error'] : null} ${styles.input}`} id="phoneNumber" name="phone" placeholder="+1 | 65654246465" />
                                    </div>
                                    <div>
                                        <label className={styles.label} htmlFor="userEmail">Email</label>
                                        <Field type="email" className={`${errors.email && touched.email ? 
                                            styles['input-error'] : null} ${styles.input}`} id="userEmail" name="email" placeholder="john-bing@gmail.Com" />
                                    </div>
                                    <div>
                                        <label className={styles.label} htmlFor="telegram">Telegram ID</label>
                                        <Field type="text" name="telegram" className={`${errors.telegram && touched.telegram ? 
                                            styles['input-error'] : null} ${styles.input}`} id="telegram" placeholder="Telegram ID" />
                                    </div>
                                    <div>
                                        <label className={styles.label} htmlFor="service">Service</label>
                                        <Field type="service" className={`${errors.service && touched.service ? 
                                            styles['input-error'] : null} ${styles.input}`} id="service" name="service" placeholder="service..." />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button className={`${styles.formBtn} ${!(dirty && isValid) ? "disabled-btn" : ""}`} disabled={!(dirty && isValid)}>Save</button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
}

export default OrderForm;
