import {initializeHost, sendPostMessageToParent} from "./utils/Host";
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
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [authenticationState, setAuthenticationState] = useState<AuthenticationState<TAuthState> | null>(null);

    useEffect(() => {
        void initialize(setIsInitialized);
    }, []);

    useHandleMessages(({data}) => {
        if (data.type !== "authenticateComplete") {
            return;
        }
        setAuthenticationState({
            authenticationState: data.state as TAuthState,
            authenticationSuccessful: data.authenticationSuccessful
        });
    }, [setAuthenticationState]);

    return {authenticationState, isInitialized};
};

/**
 *
 * The user will be navigated to the URL provided.
 * @return {string | null} documentLink
 * */
export const useDocumentUrl = () => {
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);

    useHandleMessages(ev => {
        if (ev.data.type === "deliverDocument") {
            setDocumentUrl(ev.data.documentUrl);
        }
    });

    return {documentUrl: documentUrl};
};

/**
 * Reports to Templafy that the authentication was completed. This call can only be used from the authentication pop-up.
 * Allows for arbitrary data to be sent from the pop-up to the window hosted inside the Templafy page.
 * @param {Omit<AuthenticateCompleteMessage, "type">} message
 * */
export const sendAuthenticationComplete = Templafy.sendAuthenticationComplete;

interface UseInitializeResult<TAuthState> {
    /**
     * Whether or not the initialization of the library is complete.
     * */
    isInitialized: boolean;
    /**
     * The authentication-state set by the authentication pop-up.
     * */
    authenticationState: AuthenticationState<TAuthState> | null;
}

interface AuthenticationState<TAuthState> {

    /**
     * State passed by the authentication popup
     * */
    authenticationState: TAuthState;
    /**
     * Whether the last authentication attempt reported success.
     * */
    authenticationSuccessful: boolean;
}
