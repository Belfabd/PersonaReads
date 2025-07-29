export async function startAnimations(tabId) {
    await chrome.tabs.sendMessage(tabId, {action: "start_animation"});
}

export async function stopAnimations(tabId) {
    await chrome.tabs.sendMessage(tabId, {action: "stop_animation"});
}

export function getUrl(tabId) {
    return chrome.tabs.sendMessage(tabId, {action: "get_url"});
}

export async function sendState(target, state) {
    await chrome.runtime.sendMessage({target: "sidepanel", action: target, state: state});
}

export async function analyzeItem(url) {
    return await chrome.runtime.sendMessage({target: "offscreen", action: "analyze", url: url});
}
