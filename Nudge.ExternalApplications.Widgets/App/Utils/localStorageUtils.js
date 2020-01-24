import * as logger from "@nudge/client-sdk/Logging/DefaultLogger";

export const loadState = stateKey => {
    try {
        const result = localStorage.getItem(stateKey);
        if (result === null) {
            return undefined;
        }
        return JSON.parse(result);
    } catch (err) {
        logger.error("Error loading state from local storage", err);
        return undefined;
    }
};

export const saveState = (state, stateKey) => {
    try {
        localStorage.setItem(stateKey, JSON.stringify(state));
    } catch (err) {
        logger.error("Error saving state to local storage", err);
    }
};

export const removeState = stateKey => {
    try {
        localStorage.removeItem(stateKey);
    } catch (err) {
        logger.error("Error removing state from local storage", err);
    }
};
