import { members } from "../constants/members";

export const isMember = (email) => {
    return members.some((member) => {
        return email === member;
    });
};
