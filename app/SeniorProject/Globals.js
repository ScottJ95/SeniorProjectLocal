/* A module for global variables */
import { Platform } from 'react-native';

let IS_SIMULATOR = true; /* Change me to deploy */
let ANDROID_SIMULATOR_BASE = 'http://10.0.2.2:5000';
let IOS_SIMULATOR_BASE = 'http://localhost:5000';
let LIVE_API = 'http://rwsmith.me:5000';

/* Return the correct URL depending on simulator (iOS or Android) or live API */
var getURL = function()
{
    if (IS_SIMULATOR) {
        /* On a simultaor, we will use a local API. This is different depending on ios or android. */
        if (Platform.OS.toLowerCase() == 'android') {
            return ANDROID_SIMULATOR_BASE;
        }
        else {
            return IOS_SIMULATOR_BASE;
        }
    }
    /* If we are not on the simulator, return the live working api */
    return LIVE_API;
};

module.exports =
{
    BASE_URL: getURL()
};