
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment } from "react";
import { useSelector } from "react-redux";

const Loader = () => {
    const loader = useSelector((state)=>state.loaderState);
    return (
        loader.show ? <FontAwesomeIcon icon={faSpinner} className="loader" size="4x" spin/> : <Fragment></Fragment>
    )
}

export default Loader;
