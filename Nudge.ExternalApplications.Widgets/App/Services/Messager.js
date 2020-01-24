import { saveState } from "~/App/Utils/localStorageUtils";

const MESSAGERKEY = "nudge-widget-messages";
const subscriptions = new Map();

function handleMessage(event) {
    if (event.key !== MESSAGERKEY) {
        return;
    }
    try {
        const { message = "", payload = {} } = JSON.parse(event.newValue);
        const handlers = subscriptions.get(message) || [];
        handlers.forEach(fn => fn.apply(null, [message, payload]));
    } catch {
        // noop
    }
}

export function init() {
    window.addEventListener("storage", handleMessage);
}
export function destroy() {
    window.removeEventListener("storage", handleMessage);
}
export function subscribe(messages, handler) {
    if (!messages || !handler) {
        return () => {};
    }
    messages.forEach(message => {
        const handlers = subscriptions.get(message) || [];
        subscriptions.set(message, handlers.concat(handler));
    });

    return () => {
        messages.forEach(message => {
            const handlers = subscriptions.get(message) || [];
            subscriptions.set(message, handlers.filter(h => h !== handler));
        });
    };
}
export function sendMessage(message, payload) {
    if (!message) {
        return false;
    }
    try {
        saveState({
            message,
            payload,
        }, MESSAGERKEY);
        return true;
    } catch {
        return false;
    }
}
export const messageTypes = {
    selectTeam: "SELECTTEAM",
    lockView: "LOCKVIEW",
};
