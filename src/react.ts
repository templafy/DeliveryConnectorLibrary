import {initializeHost, sendPostMessageFunctionParent} from "./utils/Host";
import {useCallback, useEffect, useState} from "react";
import {useHandleMessages} from "./utils/MessageHandlerHook";
import {Templafy} from "./index";

async function initialize(setIsInitialized: (isInitialized: boolean) => void) {
    await initializeHost();
    setIsInitialized(true);
}

/**
 * Initializes the connector. This call must be completed before any of the other API's can be used.
 * @return {UseInitializeResult<T>>}
 * */
export const useInitialize = <TAuthState>(): UseInitializeResult<TAuthState> => {
    const [isAuthenticationComplete, setIsAuthenticationComplete] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [authenticationState, setAuthenticationState] = useState<TAuthState | null>(null);

    useEffect(() => {
        void initialize(setIsInitialized);
    }, []);

    const setAuthenticationNeeded = useCallback((authenticationNeededDto: AuthenticationNeeded) => {
        sendPostMessageFunctionParent({type: "shouldAuthenticate", ...authenticationNeededDto});
    }, []);

    useHandleMessages(({data}) => {
        if (data.type !== "authenticateComplete" || !data.authenticationSuccessful) {
            return;
        }
        setAuthenticationState(data.state as TAuthState);
        setIsAuthenticationComplete(true);
        sendPostMessageFunctionParent({
            type: "shouldAuthenticate",
            shouldAuthenticate: !data.authenticationSuccessful,
            authenticationUrl: ""
        });
    }, [setAuthenticationState, setIsAuthenticationComplete]);

    return {isAuthenticationComplete, authenticationState, setAuthenticationNeeded, isInitialized};
};

/**
 *
 * @return {function} uploadComplete A function that can be called to notify Templafy that the upload has completed.
 * The user will be navigated to the URL provided.
 * @return {string | null} documentLink
 * */
export const useDocumentLink = () => {
    const [documentLink, setDocumentLink] = useState<string | null>(null);

    useHandleMessages(ev => {
        if (ev.data.type === "deliverDocument") {
            setDocumentLink(ev.data.documentUrl);
        }
    });

    return {documentLink, uploadComplete: Templafy.uploadComplete};
};

/**
 * Reports to Templafy that the page hosted in the iframe is ready to receive the documentURL.
 * This is meant for waiting for user input.
 * */
export const useOptions = () => {
    return {sendCanUpload: Templafy.sendCanUpload};
};

/**
 * Reports to Templafy that the authentication was completed. This call can only be used from the authentication pop-up.
 * Allows for arbitrary data to be sent from the pop-up to the window hosted inside the Templafy page.
 * @param {Omit<AuthenticateCompleteMessage, "type">} message
 * */
export const sendAuthenticationComplete = Templafy.sendAuthenticationComplete;

interface AuthenticationNeeded {
    shouldAuthenticate: boolean;
    authenticationUrl: string;
}

interface UseInitializeResult<T> {
    /**
     *  Whether or not the authentication is complete.
     *  */
    isAuthenticationComplete: boolean;
    /**
     * Notify Templafy if authentication is needed.
     * This will prompt Templafy to show the user a pop-up on clicking the proceed button.
     * */
    setAuthenticationNeeded: (authenticationNeeded:AuthenticationNeeded) => void;
    /**
     * Whether or not the initialization of the library is complete.
     * */
    isInitialized: boolean;
    /**
     * The authentication-state set by the authentication pop-up.
     * */
    authenticationState: T | null;
}
