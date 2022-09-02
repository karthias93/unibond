import React, { useState } from "react";
import IconButton from "./IconButton";
import UserDropdown from "./UserDropdown";
import OutsideClickDetector from "hooks/OutsideClickDetector";
import { useSelector } from "react-redux";

function UserButton() {
  const [isOn, setOn] = useState(false);
  const user = useSelector((state)=>state.authState);

  const userDropdownHandler = () => {
    setOn(true);
  };

  return (
    <IconButton img={user?.profilePic?.url ? user.profilePic.url : `${process.env.imgUrlEndpoint}/profile-picture-default_x300PldEOA.png`} onClick={userDropdownHandler} profilePic={true}>
      <UserDropdown state={[isOn, setOn]} />
    </IconButton>
  );
}

export default UserButton;
