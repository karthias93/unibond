import "scss/index.scss";
import "react-toastify/dist/ReactToastify.css";
import { IKContext } from "imagekitio-react";
import IconsSidebar from "layouts/IconsSidebar";
import SignUpScreen from "../components/SignUpScreen";
import LoginScreen from "components/LoginScreen";
import ChatModal from "components/ChatModal";
import { Provider } from "react-redux";
import { store } from "reduxState/store";
import BlackScreen from "components/BlackScreen";
import ReduxStateProvider from "HOC/ReduxStateProvider";
import { ToastContainer } from "react-toastify";
import Loader from "components/Loader";
import VerifyEmail from "components/VerifyEmail";

const toastConfiig = {};

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <IKContext publicKey="public_cpIQIqH/QSniDBAqeSdoCHQtcbE=" urlEndpoint={process.env.imgUrlEndpoint} authenticationEndpoint={`${process.env.apiUrl}/api/imagekit/auth`}>
                <IconsSidebar />
                <ToastContainer position="top-center" autoClose={2000} newestOnTop={false} pauseOnVisibilityChange closeOnClick pauseOnHover />
                <SignUpScreen />
                <LoginScreen />
                <VerifyEmail />
                <ChatModal />
                <BlackScreen />
                <ReduxStateProvider />
                <Component {...pageProps} />
                <Loader />
            </IKContext>
        </Provider>
    );
}

export default MyApp;
