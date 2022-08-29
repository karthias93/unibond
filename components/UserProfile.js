import React, {Fragment, useState} from "react";
import styles from "scss/components/UserProfile.module.scss";
import toast from "./Toast";
import { useSelector, useDispatch } from "react-redux";
import { toggleState as toggleChatScreenState } from "reduxState/slices/chatModalSlice";
import { toggleState as toggleBlackScreenState } from "reduxState/slices/blackScreenSlice";
import { chatUser } from "../reduxState/slices/chatUserSlice";
import { toCapital } from "../utils/helpers/toCapital";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fab);

function UserProfile({ id, email, name, skill, status }) {
    const dispatch = useDispatch();
    const { auth } = useSelector((state) => state.authState);
    const [accountOpen, setAccountOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);

    return (
        <div>
            <h3 className={styles.heading}>Account Settings</h3>
            <div className={styles.formContainer}>
                <div className="flex justify-between items-center ">
                    <h3 className={styles.formHeading}>Account Settings</h3>
                    <FontAwesomeIcon icon={faAngleUp} className={`${styles.formAngleUP} ${accountOpen ? styles.formAngleUpClose : styles.formAngleUpOpen}`} onClick={()=> setAccountOpen(!accountOpen)}/>
                </div>
                {accountOpen && (
                    <Fragment>
                        <div className={styles.inputsContainer}>
                            <div>
                                <label className={styles.label} htmlhtmlhtmlFor="firstName">First Name</label>
                                <input type="text" name="firstName" className={styles.input} id="firstName" placeholder="John" value="" />
                            </div>
                            <div>
                                <label className={styles.label} htmlhtmlFor="lastName">Last Name</label>
                                <input type="text" name="lastName" className={styles.input} id="lastName" placeholder="Bing" value="" />
                            </div>
                            <div>
                                <label className={styles.label} htmlhtmlFor="userEmail">Email</label>
                                <input type="email" className={styles.input} id="userEmail" name="email" placeholder="john-bing@gmail.Com" value="karthias93@gmail.com" />
                            </div>
                            <div>
                                <label className={styles.label} htmlhtmlFor="userEmail">Username</label>
                                <input type="username" className={styles.input} id="userUsername" name="username" placeholder="john-bing" value="karthick" />
                            </div>
                            <div>
                                <label className={styles.label} htmlhtmlFor="phoneNumber">Phone Number</label>
                                <input type="text" className={styles.input} id="phoneNumber" name="phone" placeholder="+1 | 65654246465" value="" />
                            </div>
                        </div>
                        <div className="flex justify-end"><button className={styles.formBtn}>Save</button></div>
                    </Fragment>
                )}
            </div>
            <div className={styles.formContainer}>
                <div className="flex justify-between items-center">
                    <h3 className={styles.formHeading}>Change Password</h3>
                    <FontAwesomeIcon icon={faAngleUp} className={`${styles.formAngleUP} ${passwordOpen ? styles.formAngleUpClose : styles.formAngleUpOpen}`} onClick={()=> setPasswordOpen(!passwordOpen)}/>
                </div>
                {passwordOpen && (
                    <Fragment>
                        <div className={styles.inputsContainer}>
                            <div>
                                <label className={styles.label} htmlFor="oldPassword">Old Password</label>
                                <input type="password" className={styles.input} id="oldPassword" placeholder="***********" />
                            </div>
                            <div>
                                <label className={styles.label} htmlFor="newPassword">New Password</label>
                                <input type="password" className={styles.input} id="newPassword" placeholder="***********" />
                            </div>
                            <div>
                                <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                                <input type="password" className={styles.input} id="confirmPassword" placeholder="***********" />
                            </div>
                        </div>
                        <div className="flex justify-end"><button className={styles.formBtn}>Change</button></div>
                    </Fragment>
                )}
            </div>
            <div className={styles.formContainer}>
                <div className="flex justify-between items-center">
                    <h3 className={styles.formHeading}>Email Notifications</h3>
                    <FontAwesomeIcon icon={faAngleUp} className={`${styles.formAngleUP} ${emailOpen ? styles.formAngleUpClose : styles.formAngleUpOpen}`} onClick={()=> setEmailOpen(!emailOpen)}/>
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
                                    <input type="checkbox" className={`${styles.input} ${styles.checkbox}`} checked="" />
                                    <button className={styles.slider} type="button"></button>
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
