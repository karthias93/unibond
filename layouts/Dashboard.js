import React, { useEffect } from "react";
import styles from "scss/layout/Dashboard.module.scss";
import CompanyProgressCard from "components/CompanyProgressCard";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import useMediaQuery from "hooks/useMediaQuery";
import { FaTwitter } from "react-icons/fa";
import FlipCard from "components/FlipCard";

import { IKImage } from "imagekitio-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { dashboardState } from "reduxState/slices/dashboardSlice";

function Dashboard() {
    const isBellow640px = useMediaQuery("(max-width : 40em)");
    const { dashboard } = useSelector((state)=>state.dashboardState);
    const dispatch = useDispatch();

    useEffect(()=>{
        axios.get(`/api/dashboard`)
            .then(({data}) => {
                dispatch(dashboardState(data));
            });
    }, [dispatch]);

    return (
        <main className={styles.main}>
            <CompanyProgressCard
                title="Total Development Ongoing"
                subtitle={dashboard?.all?.Approved ? dashboard.all.Approved : 0}
                inWeek={dashboard?.lastWeek?.Approved ? dashboard.lastWeek.Approved : 0}
                icon="icons/development-icons.png"
                iconWidth="36%"
                className={styles.card1}
            />
            <FlipCard
                frontCard={
                    <CompanyProgressCard title="Total Audit Ongoing" subtitle={dashboard?.all?.Audit ? dashboard.all.Audit : 0} inWeek={dashboard?.lastWeek?.Audit ? dashboard.lastWeek.Audit : 0} iconWidth="36%" icon="icons/total-audit-icons.png" />
                }
                backCard={<CompanyProgressCard title="Total Projects Completed" subtitle={dashboard?.all?.Completed ? dashboard.all.Completed : 0} inWeek={dashboard?.lastWeek?.Completed ? dashboard.lastWeek.Completed : 0} isYellowCard={true} />}
            />

            <CompanyProgressCard
                title="Total Marketing Ongoing"
                subtitle={dashboard?.all?.Marketing ? dashboard.all.Marketing : 0}
                inWeek={dashboard?.lastWeek?.Marketing ? dashboard.lastWeek.Marketing : 0}
                icon="icons/total-marketing-icons.png"
                iconWidth="24%"
                className={styles.card3}
            />
            <CompanyProgressCard
                title="Total Revenue Pending"
                subtitle={`$ ${dashboard?.all?.pendingRevenue ? dashboard.all.pendingRevenue : 0}`}
                inWeek={`$ ${dashboard?.lastWeek?.pendingRevenue ? dashboard.lastWeek.pendingRevenue : 0}`}
                textCenter={true}
                subtitleFontSize="fs-30px"
                className={styles.card4}
            />
            <div className={styles.tweets}>
                {/* <IKImage
        
        loading="lazy"
        lqip={{ active: true }}
        path="images/tweets.png" alt="" /> */}
                <header>
                    <span className={styles.icon}>
                        <FaTwitter color="white" />
                    </span>
                    <p className={styles.tweetsTitle}>@uni.bond</p>
                </header>
                <main>
                    <TwitterTimelineEmbed sourceType="timeline" screenName="uniBondLab" options={{ height: "400" }} noHeader={true} />
                </main>
            </div>
            <div className={styles.cards}>
                <CompanyProgressCard title="Total Projects Completed" subtitle={dashboard?.all?.Completed ? dashboard.all.Completed : 0} inWeek={dashboard?.lastWeek?.Completed ? dashboard.lastWeek.Completed : 0} isYellowCard={true} />
                <CompanyProgressCard
                    title="Total Revenue from projects"
                    subtitle={`$ ${dashboard?.all?.totalRevenue ? dashboard.all.totalRevenue : 0}`}
                    inWeek={`$ ${dashboard?.lastWeek?.totalRevenue ? dashboard.lastWeek.totalRevenue : 0}`}
                    textCenter={true}
                    subtitleFontSize="fs-30px"
                />
            </div>
            <div className={styles.ongoingProjectCode}>
                <h1 className={`fs-22px weight-7 black ${styles.onGoingTitle}`}>Ongoing Project open code.</h1>
                <div className={styles.projectCode}>
                    <IKImage path="images/codes.png" loading="lazy" lqip={{ active: true }} alt="" />
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.box1}>
                    <IKImage path="images/blockaudit-report.svg" loading="lazy" lqip={{ active: true }} className={styles.reportIcon} alt="" />
                    <div className={styles.reportTitles}>
                        <div>
                            <h4 className={`${isBellow640px ? "fs-12px" : "fs-20px"}  weight-6 black mb-5px`}>Last Audited Project:</h4>
                            <h2 className={`${isBellow640px ? "fs-14px" : "fs-24px"} black weight-8 lh-1 ${styles.reportLink}`}>
                                www.blockaudit.report
                            </h2>
                        </div>
                        <IKImage path="icons/grayYellowTick.svg" loading="lazy" lqip={{ active: true }} className={styles.reportTickIcon} alt="" />
                    </div>
                </div>

                <div className={styles.box}>
                    <p className="fs-14px weight-6 black">Inconsistencies Found : 31</p>
                    <p className="fs-14px weight-6 black">Errors Rectified : 31</p>
                    <p className="fs-14px weight-6 black">Code Analysed : 10003</p>
                </div>
                <div className={styles.box}>
                    <p className="fs-14px weight-6 black">KYC done : 35</p>
                    <p className="fs-14px weight-6 black">Payments Generated : 91</p>
                    <p className="fs-14px weight-6 black">Time Saved per transaction : 2.22s</p>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;
