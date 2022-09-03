import axios from "axios";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleState as toggleSignUpScreenState } from "reduxState/slices/signUpModalSlice";
import { toggleState as toggleVerifyEmailState } from "reduxState/slices/verifyEmailslice";
import toast from "./Toast";

const VerifyEmail = () => {
    const { verify } = useSelector((state) => state.verifyEmailState);
    const { email, show } = verify;
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(toggleSignUpScreenState(false));
    }
    const handleVerify = () => {
        axios.patch(`/api/users/verify`, {email: email}).then((res)=>{
            dispatch(toggleVerifyEmailState({show: false, email: ''}));
            toast({ type: "success", message: 'verification link sent to your email address' });
        })
        .catch(({ request: { responseText } }) => toast({ type: "error", message: `${JSON.parse(responseText).message}` }));
    }
    if (show) {
        return (
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-yellow-400 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-yellow-400 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
                            </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">Verify your email</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">Click the below link will send the verification link to your email address.</p>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="bg-yellow-400 px-4 py-3 sm:flex justify-center sm:px-6">
                        <button type="button" className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleVerify}>Verify Email</button>
                        <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <Fragment></Fragment>
    }
}

export default VerifyEmail;
