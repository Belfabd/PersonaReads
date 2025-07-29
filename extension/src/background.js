//------------------------------- Declarations
import {
    getUrl,
    sendState,
    startAnimations,
    stopAnimations,
    analyzeItem
} from "./utilities";

let creating; // A global promise to avoid concurrency issues
let activeTabId = -1;
const tabs = new Map();

//------------------------------- Starting
setupOffscreenDocument("./offscreen/offscreen.html").then(() => console.log("Offscreen Document Created"));
chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch((error) => console.error(error));
chrome.runtime.onMessage.addListener(async (message) => {
    if (message.target === "background") {
        switch (message.action) {
            case "init":
                // query current tab from title
                chrome.tabs.query({active: true, currentWindow: true}, async function (queryTabs) {
                    // sometimes activeTabId is -1 initially
                    await sendState("tab", tabs.get(queryTabs[0].id));
                });
                break;
            case "analyze":
                const itemTabId = activeTabId; // save tab id since it might change

                // start animations
                await startAnimations(itemTabId);
                await sendState("loading", {isLoading: true});

                // analyzed item
                const response = await analyzeItem(message.url);
                await stopAnimations(itemTabId);
                await sendState("loading", {isLoading: false});
                await sendState("analysis", response);
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "./images/icon128.png",
                    title: "Analyzation Completed",
                    message: `<ADD PROPER MESSAGE FOR NOTIFICATIONS>`,
                    priority: 1
                });
                break;
        }
    }
});

//------------------------------- Tab Handling
chrome.webNavigation.onCompleted.addListener(async (details) => {
    // Send url to the sidepanel
    if (details.frameId === 0) {
        // query current tab from title
        chrome.tabs.query({active: true, currentWindow: true}, async function (queryTabs) {
            // TODO: Handle all url cases
            activeTabId = queryTabs[0].id;
            tabs.set(activeTabId, {
                url: await getUrl(activeTabId),
                title: queryTabs[0].title,
                isSystem: details.url.startsWith("chrome://")
            });
            await sendState("tab", tabs.get(activeTabId));
        });
    }
});
chrome.tabs.onRemoved.addListener((tabId, _removeInfo) => {
    tabs.delete(tabId);
});
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    activeTabId = activeInfo.tabId;// update activeTabId
    // send article/url to sidepanel
    await sendState("tab", tabs.get(activeTabId));
});

//------------------------------- Handle Offscreen Documents
async function setupOffscreenDocument(path) {
    // Check if there is an offscreen document with the given path
    const offscreenUrl = chrome.runtime.getURL(path);
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [offscreenUrl]
    });

    if (existingContexts.length > 0) {
        return;
    }

    // create offscreen document
    if (creating) {
        await creating;
    } else {
        try {
            creating = chrome.offscreen.createDocument({
                url: path,
                reasons: ['DOM_SCRAPING'],
                justification: 'this document is used to communicate with firebase (Auth, Firestore, Functions)',
            });
            await creating;
            creating = null;
        } catch (e) {
            //trying to re-create an offscreen document, stop
            creating = null
        }
    }
}
