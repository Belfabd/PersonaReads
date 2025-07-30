// Create Animated Overlay
function createOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "personareads-overlay";
    document.body.appendChild(overlay);
}

function getNormalizedUrl() {
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    const rawUrl = canonical || window.location.href;

    const url = new URL(rawUrl);

    url.search = ''; // remove query params
    url.hash = '';   // remove fragment

    let href = url.href;

    // Remove trailing slash (except for root)
    if (href.endsWith('/') && url.pathname !== '/') {
        href = href.slice(0, -1);
    }

    return href.toLowerCase();
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    switch (message.action) {
        case "start_animation":
            createOverlay();
            break;
        case "get_url":
            sendResponse(getNormalizedUrl());
            break;
        case "stop_animation":
            const overlaysByClass = document.getElementsByClassName("personareads-overlay");
            if (overlaysByClass.length > 0) document.body.removeChild(overlaysByClass[0]);
            break;
    }
});
