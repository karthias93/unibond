import React, { Fragment, useEffect, useState } from "react";
import styles from "scss/components/UserProfile.module.scss";
import toast from "./Toast";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { auth as authState } from "reduxState/slices/authSlice";
import Image from "next/image";
import { IKImage, IKUpload } from "imagekitio-react";

// library.add({fab,far});
library.add(far, fab);

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
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    newPassword: Yup.string().required('New password is required')
});

function UserProfile() {
    const dispatch = useDispatch();
    const [accountOpen, setAccountOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [emailNotification, setEmailNotification] = useState(false);
    const [accountEdit, setAccountEdit] = useState(false);
    const user = useSelector((state) => state.authState);
    

    useEffect(() => {
        if (user) setEmailNotification(user.emailNotification);
    }, [user])
    const updateUser = (values) => {
        axios
            .patch(`/api/users`, {
                ...values,
                id: user.id,
                isMember: user.isAdmin
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
        updateUser(values);
    };

    const notificationToggle = () => {
        const noti = !emailNotification;
        setEmailNotification(noti);
        updateUser({ emailNotification: noti });
    }

    const onSuccess = (data) => {
        axios
            .post(`/api/users/profilepic`, { ...data, isMember: user.isAdmin, id: user.id })
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

    const onError = (err) => {
        console.log(err)
    }
    return (
        <div className="lg:container mx-auto">
            <div className="mb-6">
                <h1 className="text-4xl font-bold mb-1 black">
                    Hey <span className="yellow">Jamie,</span>
                </h1>
                <p className="text-base font-normal black">
                    Welcome back! Take a look at your profile here.
                </p>
            </div>
            <div className={`${styles.flexWrap} flex gap-4`}>
                <div className="w-full lg:w-3/5 ">
                    <div className={`${styles.profileCard} p-6 mb-8`}>
                        <div className="text-base font-bold white mb-5">
                            Account Details
                        </div>
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
                            enableReinitialize={true}
                        >
                            {(formik) => {
                                const { errors, touched, isValid, dirty } = formik;
                                return (
                                    <Form>
                                        <div className={`grid grid-cols-2 gap-4 ${styles['account-form']}`}>
                                            <div className="mb-3">
                                                <label className="text-sm white truncate" htmlFor="firstName">First Name :</label>
                                                {accountEdit && <Field type="text" name="firstName" className={`${errors.firstName && touched.firstName ?
                                                    styles['input-error'] : null} ${styles.input}`} id="firstName" placeholder="John" />}
                                                {!accountEdit && <div className="text-base font-bold white truncate">
                                                    {user?.firstName}
                                                </div>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="text-base white truncate" htmlFor="lastName">Second Name :</label>
                                                {accountEdit && <Field type="text" name="lastName" className={`${errors.lastName && touched.lastName ?
                                                    styles['input-error'] : null} ${styles.input}`} id="lastName" placeholder="Bing" />}
                                                {!accountEdit && <div className="text-base font-bold white truncate">
                                                    {user?.lastName}
                                                </div>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="text-sm white truncate" htmlFor="userEmail">Email :</label>
                                                {accountEdit && <Field type="email" className={`${errors.email && touched.email ?
                                                    styles['input-error'] : null} ${styles.input}`} id="userEmail" name="email" placeholder="john-bing@gmail.Com" disabled={user.isAdmin} />}
                                                 {!accountEdit &&<div className="text-base font-bold white truncate">
                                                    {user?.email}
                                                </div>}
                                            </div>
                                            <div className="mb-3">
                                            <label className="text-sm white truncate" htmlFor="userName">Username :</label>
                                                {accountEdit && <Field type="text" className={`${errors.username && touched.username ?
                                                    styles['input-error'] : null} ${styles.input}`} id="userUsername" name="username" placeholder="john-bing" />}
                                                {!accountEdit && <div className="text-base font-bold white truncate">
                                                    {user?.username}
                                                </div>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="text-sm white truncate" htmlFor="phoneNumber">Phone Number:</label>
                                                {accountEdit && <Field type="text" className={`${errors.phone && touched.phone ?
                                                    styles['input-error'] : null} ${styles.input}`} id="phoneNumber" name="phone" placeholder="+1 | 65654246465" />}
                                                {!accountEdit && <div className="text-base font-bold white truncate">
                                                    {user?.phone}
                                                </div>}
                                            </div>
                                            <div className="w-1/2 mb-3 flex">
                                                <button className="text-sm white py-2 px-6 border border-white rounded-xl border-solid self-end" onClick={()=>setAccountEdit(!accountEdit)}>{accountEdit ? 'Save' : 'Change'}</button>
                                            </div>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className={`${styles.socialCard} px-6 pt-6 pb-4 mb-5`}>
                                <div className="text-base black font-bold  mb-5">
                                    Social Profiles
                                </div>
                                <div>
                                    <div className={styles.socilaAccount}>
                                        <div className={`${styles.socialAccountNameContainer} black`}>
                                            <FontAwesomeIcon icon={["fab", "linkedin"]} className={styles.socialAccountIcon} />
                                            <h4 className={`${styles.socialAccountName} text-sm black`}>Linkedin</h4>
                                        </div>
                                        <div className={styles.socilaAccountStatus}>Connect</div>
                                    </div>
                                    <div className={styles.socilaAccount}>
                                        <div className={`${styles.socialAccountNameContainer} black`}>
                                            <FontAwesomeIcon icon={["fab", "twitter"]} className={styles.socialAccountIcon} />
                                            <h4 className={`${styles.socialAccountName} text-sm black`}>Twitter</h4>
                                        </div>
                                        <div className={styles.socilaAccountStatus}>Connect</div>
                                    </div>
                                    <div className={styles.socilaAccount}>
                                        <div className={`${styles.socialAccountNameContainer} black`}>
                                            <FontAwesomeIcon icon={["fab", "facebook"]} className={styles.socialAccountIcon} />
                                            <h4 className={`${styles.socialAccountName} text-sm black`}>Facebook</h4>
                                        </div>
                                        <div className={styles.socilaAccountStatus}>Connect</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={`${styles.changePasswordCard} px-6 pt-6 pb-4 mb-5`}>
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

                                                            <Field type="password" className={`${errors.oldPassword && touched.oldPassword ?
                                                                styles['input-error'] : null} ${styles.input} text-xs`} id="oldPassword" name="oldPassword" placeholder="Old Password" />
                                                        </div>
                                                        <div>
                                                            <Field type="password" className={`${errors.newPassword && touched.newPassword ?
                                                                styles['input-error'] : null} ${styles.input} text-xs`} id="newPassword" name="newPassword" placeholder="New Password" />
                                                        </div>
                                                        <div>
                                                            <Field type="password" className={`${errors.confirmPassword && touched.confirmPassword ?
                                                                styles['input-error'] : null} ${styles.input} text-xs`} id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end"><button className={`${styles.formBtn} ${!(dirty && isValid) ? "disabled-btn" : ""}`} disabled={!(dirty && isValid)}>Save</button></div>
                                                </Form>
                                            );
                                        }}
                                    </Formik>
                                </Fragment>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-2/5 ">
                    <div className={`${styles.borderheight} xl:ml-16`}>
                        <div className={`${styles.bgBorder}`}></div>
                        <div className={`${styles['image-upload']}`}>
                            <IKImage path={user?.profilePic?.filePath ? user.profilePic.filePath : '/profile-picture-default_x300PldEOA.png'} alt="" loading="lazy" lqip={{ active: true }} className="relative w-100 mb-3" />
                            <div className="flex justify-center">
                                <label htmlFor="file-input" className={`${styles.imgUplodBtn} relative cursor-pointer`}>
                                    {user?.profilePic?.filePath ? 'Edit Profile Picture ' : 'Upload Image '}<FontAwesomeIcon icon={faPencil} />
                                </label>
                                <IKUpload id="file-input" accept="image/*" onSuccess={onSuccess} onError={onError} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* <h3 className={styles.heading}>Account Settings</h3>
            <div className={styles.formContainer}>
                <div className="flex justify-between items-center ">
                    <h3 className={styles.formHeading}>Account Settings</h3>
                    <FontAwesomeIcon icon={faAngleUp} className={`${styles.formAngleUP} ${accountOpen ? styles.formAngleUPClose : styles.formAngleUPOpen}`} onClick={() => setAccountOpen(!accountOpen)} />
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
                                                    styles['input-error'] : null} ${styles.input}`} id="userEmail" name="email" placeholder="john-bing@gmail.Com" disabled={user.isAdmin} />
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
                    <FontAwesomeIcon icon={faAngleUp} className={`${styles.formAngleUP} ${passwordOpen ? styles.formAngleUPClose : styles.formAngleUPOpen}`} onClick={() => setPasswordOpen(!passwordOpen)} />
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
                    <h3 className={styles.formHeading}>Profile picture</h3>
                    <FontAwesomeIcon icon={faAngleUp} className={`${styles.formAngleUP} ${profileOpen ? styles.formAngleUPClose : styles.formAngleUPOpen}`} onClick={() => setProfileOpen(!profileOpen)} />
                </div>
                {profileOpen && (
                    <div className={`mt-10 ${styles['image-upload']}`}>
                        <IKImage path={user?.profilePic?.filePath ? user.profilePic.filePath : '/profile-picture-default_x300PldEOA.png'} alt="" loading="lazy" lqip={{ active: true }} width={200} height={200} />
                        <div className="flex justify-start">
                            <label htmlFor="file-input" className={styles.formBtn}>
                                Upload Image
                            </label>
                            <IKUpload id="file-input" accept="image/*" onSuccess={onSuccess} onError={onError} />
                        </div>
                    </div>
                )}
            </div>
            {!user.isAdmin && (
                <div className={styles.formContainer}>
                    <div className="flex justify-between items-center">
                        <h3 className={styles.formHeading}>Email Notifications</h3>
                        <FontAwesomeIcon icon={faAngleUp} className={`${styles.formAngleUP} ${emailOpen ? styles.formAngleUPClose : styles.formAngleUPOpen}`} onClick={() => setEmailOpen(!emailOpen)} />
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
            )}
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
                        <FontAwesomeIcon icon={["fab", "facebook"]} className={styles.socialAccountIcon} />
                        <h4 className={styles.socialAccountName}>Facebook</h4>
                    </div>
                    <div className={styles.socilaAccountStatus}>Connect</div>
                </div>
            </div> */}
        </div>
    );
}

export default UserProfile;
