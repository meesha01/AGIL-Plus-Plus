/**
 * Content script that deals with localStorage
 * Inserts a Prefix to each key to distinguish from other localStorage data
 */

//Prefix to distinguish from other local storage data:
const LOCAL_STORAGE_PREFIX = "agilplusplus_data__";

function saveData(key, value){
    console.debug("Key: " + key);
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
    console.debug("Data from localStorage: " + JSON.stringify(value));
}

async function getAllKeys() {
    return Object.keys(localStorage)
        .filter(key => key.startsWith(LOCAL_STORAGE_PREFIX))
        .map(key => key.substring(LOCAL_STORAGE_PREFIX.length));
}

function getValue(key){
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_PREFIX+key));
}
