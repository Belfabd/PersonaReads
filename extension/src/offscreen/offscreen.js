import {app} from '../configs';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth/web-extension';
import {
    getFirestore,
} from 'firebase/firestore';
import {getFunctions, httpsCallable} from 'firebase/functions';

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// listen to auth state
auth.onAuthStateChanged(async (user) => {
    await chrome.runtime.sendMessage({target: "background", action: "userIn", isLoggedIn: user != null});
});


// Listen for messages from sidepanel & background service worker
chrome.runtime.onMessage.addListener(handleChromeMessages);

// TODO: Check firestore before calling functions
function handleChromeMessages(message, _sender, sendResponse) {
    if (message.target === "offscreen") switch (message.action) {
        //--------------------------- Authentication
        case "register":
            (async () => {
                try {
                    let userCreds = await createUserWithEmailAndPassword(auth, message.email, message.password);
                    sendResponse({userId: userCreds.user.uid, authenticated: true});
                } catch (e) {
                    sendResponse({authenticated: false, error: e.message});
                }
            })();
            return true;
        case "login":
            (async () => {
                try {
                    let userCreds = await signInWithEmailAndPassword(auth, message.email, message.password);
                    sendResponse({userId: userCreds.user.uid, authenticated: true});
                } catch (e) {
                    sendResponse({authenticated: false, error: e.message});
                }
            })();
            return true;
        case "isLoggedIn":
            sendResponse({isLoggedIn: auth.currentUser != null});
            break;
        case "logout":
            auth.signOut().then(() => console.log("Logged Out!"));
            break;

        //--------------------------- Analyzer
        case "analyze":
            (async () => {
                const analyzeItem = httpsCallable(functions, 'analyzeItem');
                analyzeItem({url: message.url})
                    .then(res => {
                        const result = res.data;
                        if (result.error) sendResponse({error: result.error, item: null});
                        else sendResponse({error: null, item: result});
                    });
            })();
            return true;
    }
}
