import OutsideClickDetector from "hooks/OutsideClickDetector";
import React, { useState } from "react";
import BellDropdown from "./BellDropdown";
import IconButton from "./IconButton";

function BellIcon() {
    const [isOn, setOn] = useState(false);
    const dropdownRef = OutsideClickDetector(() => setOn(false));
    const { notifications } = useSelector((state) => state.notificationsState);

    const userDropdownHandler = () => {
        setOn(true);
    };

    return (
        <IconButton icon="images/icons/BellIcon.svg" notify={notifications?.length ? true : false} onClick={userDropdownHandler}>
            <BellDropdown state={[isOn, setOn]} ref={dropdownRef} />
        </IconButton>
    );
}

export default BellIcon;
