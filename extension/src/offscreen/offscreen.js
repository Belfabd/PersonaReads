import {app} from '../configs';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth/web-extension';
import {
    getFirestore,
    getDoc,
    doc,
} from 'firebase/firestore';
import {getFunctions, httpsCallable, connectFunctionsEmulator} from 'firebase/functions';

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// listen to auth state
auth.onAuthStateChanged(async (user) => {
    await chrome.runtime.sendMessage({target: "background", action: "userIn", isLoggedIn: user != null});
});

// Listen for messages from sidepanel & background service worker
chrome.runtime.onMessage.addListener(handleChromeMessages);

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
        case "get_user_details":
            getDoc(doc(db, "users", auth.currentUser.uid)).then(async querySnapshot => {
                sendResponse(querySnapshot.exists() ? {user: querySnapshot.data()} : undefined);
            });
            return true;
        case "analyze":
            (async () => {
                const analyzeBook = httpsCallable(functions, 'analyzeBook');
                analyzeBook({name: message.name, userId: auth.currentUser.uid}).then(res => {
                    const result = res.data;
                    if (result.error) sendResponse({error: result.error, bookAnalysis: null});
                    else sendResponse({error: null, bookAnalysis: result});
                });
            })();
            return true;
    }
}
