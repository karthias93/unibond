import { useEffect, useCallback, useState } from "react";
import DashboardLayout from "layouts/DashboardLayout";
import MyOrders from "components/MyOrders";
import { connectToDatabase } from "lib/mongoose/mongoDB";
import { usersState } from "reduxState/slices/usersSlice";
import { auth as authState } from "reduxState/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { socket } from "components/ChatModal";
import { useRouter } from "next/router";

export default function Order({ isConnected }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [members, setMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const { id, isAdmin } = useSelector((state) => state.authState);

    let findUsers = useCallback(() => {
        !isAdmin ? dispatch(usersState({ users: members })) : dispatch(usersState({ users }));
    }, [dispatch, isAdmin, members, users]);

    useEffect(() => {
        findUsers();
    }, [findUsers, id]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user) {
            dispatch(authState({ ...user }));
            socket.current?.emit("add-user", user.id);
        }
        axios.get(`${process.env.apiUrl}/api/members/`).then(({ data }) => setMembers(data));
        axios.get(`${process.env.apiUrl}/api/users/`).then(({ data }) => setUsers(data));
    }, [dispatch, id]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user || (user.isAdmin && !user.superAdmin)) {
          router.push("/")
        }
      }, []);
    return (
        <div>
            <DashboardLayout pageName="Order">
                <MyOrders />
            </DashboardLayout>
        </div>
    );
}

export async function getServerSideProps() {
    try {
        await connectToDatabase();

        await fetch(`${process.env.apiUrl}/api/sockets`);

        return {
            props: { isConnected: true },
        };
    } catch (e) {
        console.error(e);
        return {
            props: { isConnected: false },
        };
    }
}
