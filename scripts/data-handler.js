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
    const keys = [];
    for(let i=0; i<localStorage.length; i++) {
        const key = localStorage.key(i);
        if(key.startsWith(LOCAL_STORAGE_PREFIX))
            keys.push(key.substring(LOCAL_STORAGE_PREFIX.length));
    }
    return keys;
}

function getValue(key){
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_PREFIX+key));
}
