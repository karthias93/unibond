import React, {Fragment, useEffect, useState} from "react";
import styles from "scss/components/UserProfile.module.scss";
import toast from "./Toast";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { isMember } from "../utils/helpers/member";
import axios from "axios";
import { auth as authState } from "reduxState/slices/authSlice";

library.add(fab);

const AccountSettingsSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string().email().required("Email is required"),
    username: Yup.string().required("Username is required"),
    phone: Yup.string()
});

const changePasswordSchema = Yup.object({
    oldPassword: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
       .oneOf([Yup.ref('oldPassword'), null], 'Passwords must match'),
    newPassword: Yup.string().required('New password is required')
  });

function UserProfile() {
    const dispatch = useDispatch();
    const [accountOpen, setAccountOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);
    const [emailNotification, setEmailNotification] = useState(false);
    const user = useSelector((state)=> state.authState);

    useEffect(()=>{
        if(user) setEmailNotification(user.emailNotification);
    }, [user])
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

    const notificationToggle = () => {
        const noti = !emailNotification;
        setEmailNotification(noti);
        updateUser({emailNotification: noti});
    }

    return (
        <div>
            <h3 className={styles.heading}>Account Settings</h3>
            <div className={styles.formContainer}>
                <div className="flex justify-between items-center ">
                    <h3 className={styles.formHeading}>Account Settings</h3>
                    <FontAwesomeIcon icon={faAngleUp} className={`${styles.formAngleUP} ${accountOpen ? styles.formAngleUPClose : styles.formAngleUPOpen}`} onClick={()=> setAccountOpen(!accountOpen)}/>
                </div>
                {accountOpen && (
                    <Fragment>
                        <Formik
                            initialValues={{
                                firstName: user?.firstName ? user.firstName : '',
                                lastName: user?.lastName ? user.lastName : '',
                                username: user?.username ? user.username : '',
                                email: user?.email ? user.email : '',
                                phone: user?.phone ? user.phone : ''
                            }}
                            validationSchema={AccountSettingsSchema}
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
                                                <label className={styles.label} htmlFor="firstName">First Name</label>
                                                <Field type="text" name="firstName" className={`${errors.firstName && touched.firstName ? 
                                                    styles['input-error'] : null} ${styles.input}`} id="firstName" placeholder="John" />
                                            </div>
                                            <div>
                                                <label className={styles.label} htmlFor="lastName">Last Name</label>
                                                <Field type="text" name="lastName" className={`${errors.lastName && touched.lastName ? 
                                                    styles['input-error'] : null} ${styles.input}`} id="lastName" placeholder="Bing" />
                                            </div>
                                            <div>
                                                <label className={styles.label} htmlFor="userEmail">Email</label>
                                                <Field type="email" className={`${errors.email && touched.email ? 
                                                    styles['input-error'] : null} ${styles.input}`} id="userEmail" name="email" placeholder="john-bing@gmail.Com" />
                                            </div>
                                            <div>
                                                <label className={styles.label} htmlFor="userEmail">Username</label>
                                                <Field type="username" className={`${errors.username && touched.username ? 
                                                    styles['input-error'] : null} ${styles.input}`} id="userUsername" name="username" placeholder="john-bing" />
                                            </div>
                                            <div>
                                                <label className={styles.label} htmlFor="phoneNumber">Phone Number</label>
                                                <Field type="text" className={`${errors.phone && touched.phone ? 
                                                    styles['input-error'] : null} ${styles.input}`} id="phoneNumber" name="phone" placeholder="+1 | 65654246465" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button className={`${styles.formBtn} ${!(dirty && isValid) ? "disabled-btn" : ""}`} disabled={!(dirty && isValid)}>Save</button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </Fragment>
                )}
            </div>
            <div className={styles.formContainer}>
                <div className="flex justify-between items-center">
                    <h3 className={styles.formHeading}>Change Password</h3>
                    <FontAwesomeIcon icon={faAngleUp} className={`${styles.formAngleUP} ${passwordOpen ? styles.formAngleUPClose : styles.formAngleUPOpen}`} onClick={()=> setPasswordOpen(!passwordOpen)}/>
                </div>
                {passwordOpen && (
                    <Fragment>
                        <Formik
                            initialValues={{
                                oldPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            }}
                            validationSchema={changePasswordSchema}
                            onSubmit={(values) => {
                                delete values.confirmPassword;
                                submitHandler(values);
                            }}
                        >
                            {(formik) => {
                                const { errors, touched, isValid, dirty } = formik;
                                return (
                                    <Form>
                                        <div className={styles.inputsContainer}>
                                            <div>
                                                {console.log(errors, touched)}
                                                <label className={styles.label} htmlFor="oldPassword">Old Password</label>
                                                <Field type="password" className={`${errors.oldPassword && touched.oldPassword ? 
                                                    styles['input-error'] : null} ${styles.input}`} id="oldPassword" name="oldPassword" placeholder="***********" />
                                            </div>
                                            <div>
                                                <label className={styles.label} htmlFor="newPassword">New Password</label>
                                                <Field type="password" className={`${errors.newPassword && touched.newPassword ? 
                                                    styles['input-error'] : null} ${styles.input}`} id="newPassword" name="newPassword" placeholder="***********" />
                                            </div>
                                            <div>
                                                <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                                                <Field type="password" className={`${errors.confirmPassword && touched.confirmPassword ? 
                                                    styles['input-error'] : null} ${styles.input}`} id="confirmPassword" name="confirmPassword" placeholder="***********" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end"><button className={`${styles.formBtn} ${!(dirty && isValid) ? "disabled-btn" : ""}`} disabled={!(dirty && isValid)}>Change</button></div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </Fragment>
                )}
            </div>
            <div className={styles.formContainer}>
                <div className="flex justify-between items-center">
                    <h3 className={styles.formHeading}>Email Notifications</h3>
                    <FontAwesomeIcon icon={faAngleUp} className={`${styles.formAngleUP} ${emailOpen ? styles.formAngleUPClose : styles.formAngleUPOpen}`} onClick={()=> setEmailOpen(!emailOpen)}/>
                </div>
                {emailOpen && (
                    <div className="mt-10">
                        <div className={styles.notification}>
                            <div>
                                <h3 className={styles.notificationHeading}>Updates And Offers</h3>
                                <div className={styles.notificationDetails}>Discounts, Special Offers, New Features And More</div>
                            </div>
                            <div className={styles.switch}>
                                <span className={styles.span}>
                                    <input type="checkbox" className={`${styles.input} ${styles.checkbox}`} checked={emailNotification} />
                                    <button className={styles.slider} type="button" onClick={notificationToggle}></button>
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.formContainer}>
                <div className="flex justify-between items-center mb-10">
                    <h3 className={styles.formHeading}>Social Profile</h3>
                </div>
                <div className={styles.socilaAccount}>
                    <div className={styles.socialAccountNameContainer}>
                        <FontAwesomeIcon icon={["fab", "linkedin"]} className={styles.socialAccountIcon} />
                        <h4 className={styles.socialAccountName}>Linkedin</h4>
                    </div>
                    <div className={styles.socilaAccountStatus}>Connect</div>
                </div>
                <div className={styles.socilaAccount}>
                    <div className={styles.socialAccountNameContainer}>
                        <FontAwesomeIcon icon={["fab", "twitter"]} className={styles.socialAccountIcon} />
                        <h4 className={styles.socialAccountName}>Twitter</h4>
                    </div>
                    <div className={styles.socilaAccountStatus}>Connect</div>
                </div>
                <div className={styles.socilaAccount}>
                    <div className={styles.socialAccountNameContainer}>
                        <FontAwesomeIcon icon={["fab", "facebook"]} className={styles.socialAccountIcon}/>
                        <h4 className={styles.socialAccountName}>Facebook</h4>
                    </div>
                    <div className={styles.socilaAccountStatus}>Connect</div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
