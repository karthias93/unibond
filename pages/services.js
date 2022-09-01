import DashboardLayout from "layouts/DashboardLayout";
import Services from "layouts/Services";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth as authState } from "reduxState/slices/authSlice";

export default function ServicesPage() {
    const dispatch = useDispatch();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user) {
            dispatch(authState({ ...user }));
        }
    }, [dispatch]);

    return (
        <div>
            <DashboardLayout pageName="Services">
                <Services />
            </DashboardLayout>
        </div>
    );
}
