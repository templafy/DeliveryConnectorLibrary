import {
    initializeHost,
    sendPostMessageFunctionOpener,
    sendPostMessageFunctionParent,
    waitForPostMessage
} from "./utils/Host";
import {AuthenticateCompleteMessage, CanUploadMessage, DeliverDocumentMessage} from "./utils/MessagePassings";

const defaultTimeoutMs = 200_000;

declare global {
    interface External  {
        OAuth2Callback: (state: string) => void;
    }
}

export namespace Templafy {
    /**
     * @return A promise that will resolve with the documentURL once the user clicks the `save` button.
     * */
    export const getDocumentUrl = async (timeoutMs: number = defaultTimeoutMs) => {
        const {documentUrl} = await waitForPostMessage<DeliverDocumentMessage>("deliverDocument", timeoutMs);
        return documentUrl;
    };

    /**
     * Initializes the connector. This call must be completed before any of the other API's can be used.
     * @param {InitializeParams} initializeParams
     * @param {number} timeoutMs the timeout for initializing. Defaults to 200000 ms.
     * */
    export const initialize = async ({shouldAuthenticate, authenticationUrl}: InitializeParams, timeoutMs: number = defaultTimeoutMs) => {
        await initializeHost();

        sendPostMessageFunctionParent({type: "shouldAuthenticate", shouldAuthenticate, authenticationUrl});
        if (!shouldAuthenticate) {
            return {authenticationState: null};
        }
        const {state, authenticationSuccessful} = await waitForPostMessage<AuthenticateCompleteMessage>("authenticateComplete", timeoutMs);
        if (!authenticationSuccessful) {
            throw new Error("Authentication failed");
        }
        sendPostMessageFunctionParent({
            type: "shouldAuthenticate",
            shouldAuthenticate: false,
            authenticationUrl
        });
        return {authenticationState: state};
    };
    /**
     * Reports to Templafy that the authentication was completed. This call can only be used from the authentication pop-up.
     * Allows for arbitrary data to be sent from the pop-up to the window hosted inside the Templafy page.
     * @param {Omit<AuthenticateCompleteMessage, "type">} message
     * */
    export const sendAuthenticationComplete = async (message: Omit<AuthenticateCompleteMessage, "type">) => {
        if ("OAuth2Callback" in window.external) {
            window.external.OAuth2Callback(JSON.stringify(message));
        } else {
            await initializeHost();
            sendPostMessageFunctionOpener({type: "authenticateComplete", ...message});
        }
    };

    /**
     * Reports to Templafy that the upload of a document has completed.
     * @param {string} documentLocation the location that is to be opened by templafy. Should be a URL that points to the uploaded document.
     * */
    export const uploadComplete = (documentLocation: string) => {
        sendPostMessageFunctionParent({type: "doneUploading", documentLocation});
    };

    /**
     * Reports to Templafy that the page hosted in the iframe is ready to receive the documentURL.
     * This is meant for waiting for user input.
     * @param {Omit<CanUploadMessage, "type">} canUploadMessage
     * */
    export const sendCanUpload = (canUploadMessage: Omit<CanUploadMessage, "type">) => {
        sendPostMessageFunctionParent({...canUploadMessage, type: "canUpload"});
    };
}

interface InitializeParams {
    /**
     * Whether or not Templafy should show a pop-up to authenticate the user.
     * */
    shouldAuthenticate: boolean;
    /**
     * The URL for the popup that is to be opened.
     * */
    authenticationUrl: string;
}
