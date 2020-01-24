const profileColours = [
    "profile-red",
    "profile-green",
    "profile-blueGray",
    "profile-orange",
    "profile-black",
    "profile-lightGreen",
    "profile-pink",
    "profile-purple",
    "profile-teal",
    "profile-lightPink",
    "profile-darkBlue",
    "profile-darkRed",
    "profile-darkGreen",
    "profile-blue",
    "profile-brown",
];
const profileHex = [
    "ef5350",
    "43a047",
    "607d8b",
    "e65100",
    "000000",
    "33691e",
    "ad1457",
    "7b1fa2",
    "009688",
    "ec407a",
    "0d47a1",
    "c62828",
    "1b5e20",
    "1e88e5",
    "795548",
];
const hashString = str => {
    let hash = 0,
        chr;
    for (let i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
export const getProfileColour = (str = "", useHex = false) => {
    const coloursLength = profileColours.length;
    let index;
    if (!str) {
        index = Math.floor(Math.random() * coloursLength);
    } else {
        index = Math.abs(hashString(str + "")) % coloursLength;
    }
    return useHex ? profileHex[index] : profileColours[index];
};