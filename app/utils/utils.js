import {Platform} from 'react-native';


export const formatNumber = (number) => {
    if (!number) return "";
    if (number.length > 1) return number;

    let changed = ("0" + number).slice(-2);
    return changed;
}