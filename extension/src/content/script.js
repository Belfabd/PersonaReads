// Create Animated Overlay
function createOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "personareads-overlay";
    document.body.appendChild(overlay);
}

function getBookName() {
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
    const normalizedUrl = href.toLowerCase();

    // Check if link is a GoodReads book
    const goodReadsRegex = /^https?:\/\/(www\.)?goodreads\.com\/book\/show\/\d+([-.][a-z0-9._-]+)?\/?$/i;
    const amazonRegex = /^https?:\/\/(www\.)?amazon\.[a-z.]+\/(gp\/product|dp)\/[A-Z0-9]{10}(\/|$)/i;
    console.log(goodReadsRegex.test(normalizedUrl))
    const pageType = goodReadsRegex.test(normalizedUrl) ? "GoodReads" : amazonRegex.test(normalizedUrl) ? "Amazon" : undefined;

    switch (pageType) {
        case "GoodReads":
            const grTitleElement = document.querySelector('[data-testid="bookTitle"]');
            return grTitleElement?.textContent?.trim();
        case "Amazon":
            const aTitleElement = document.querySelector('#productTitle');
            return aTitleElement?.textContent?.trim();
        case undefined:
            return undefined;
    }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    switch (message.action) {
        case "start_animation":
            createOverlay();
            break;
        case "get_book_name":
            sendResponse(getBookName());
            break;
        case "stop_animation":
            const overlaysByClass = document.getElementsByClassName("personareads-overlay");
            if (overlaysByClass.length > 0) document.body.removeChild(overlaysByClass[0]);
            break;
    }
});
