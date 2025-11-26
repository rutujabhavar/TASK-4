importScripts("firebase/firebase.js");

let activeSite = null;
let startTime = Date.now();

chrome.tabs.onActivated.addListener(async info => {
    const tab = await chrome.tabs.get(info.tabId);
    switchSite(tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (tab.active && change.url) switchSite(change.url);
});

function switchSite(url) {
    const now = Date.now();
    if (activeSite) {
        const duration = (now - startTime) / 1000;

        saveTime(activeSite, duration);
    }
    activeSite = extractDomain(url);
    startTime = now;
}

function extractDomain(url) {
    try {
        return new URL(url).hostname.replace("www.", "");
    } catch {
        return "unknown";
    }
}

function saveTime(site, seconds) {
    const day = new Date().toISOString().slice(0, 10);
    firebase.database().ref(`usage/${day}/${site}`).push({
        seconds,
        timestamp: Date.now()
    });
}
