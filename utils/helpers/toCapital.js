export const toCapital = (text) => {
    let capitalizeText = "";
    text.split(" ").forEach((t) => (capitalizeText += t.slice(0, 1).toUpperCase() + t.slice(1) + " "));
    return capitalizeText;
};
