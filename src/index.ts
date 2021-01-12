import {
    initializeHost,
    sendPostMessageFunctionOpener,
    sendPostMessageToParent,
    waitForPostMessage
} from "./utils/Host";
import {AuthenticateCompleteMessage, CanUploadMessage, DeliverDocumentMessage} from "./utils/MessagePassings";

const defaultTimeoutMs = 200_000;

declare global {
    interface External {
        OAuth2Callback: (state: string) => void;
    }

    interface Window {
        chrome?: {
            webview?: {
                hostObjects: {
                    sync: {
                        bridge: {
                            ExecuteMethod: (methodName: "OAuth2Callback", invocationId: string, args: [string]) => Promise<void>
                        };
                    };
                };
            };

        };
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
     * */
    export const initialize = async () => {
        await initializeHost();
    };

    /**
     * @param params {ShouldAuthenticateParams}
     * */
    export const sendShouldAuthenticate = (params: ShouldAuthenticateParams) => {
        sendPostMessageToParent({type: "shouldAuthenticate", ...params})
    }

    /**
     * @param {number} timeoutMs timeout for waiting for authenticationResult. Defaults to 200000 ms.
     * */
    export const getAuthenticationState = async <T>(timeoutMs: number = defaultTimeoutMs) => {
        const {state, authenticationSuccessful} = await waitForPostMessage<AuthenticateCompleteMessage>("authenticateComplete", timeoutMs);
        return {authenticationState: state as T, authenticationSuccessful} ;
    }

    /**
     * Sets that the next action is to show the content of the Delivery Controller
     * */
    export const sendRequireInput = () => {
        sendPostMessageToParent({type: "requireInput"})
    }

    /**
     * Reports to Templafy that the authentication was completed. This call can only be used from the authentication pop-up.
     * Allows for arbitrary data to be sent from the pop-up to the window hosted inside the Templafy page.
     * @param {Omit<AuthenticateCompleteMessage, "type">} message
     * */
    export const sendAuthenticationComplete = async (message: Omit<AuthenticateCompleteMessage, "type">) => {
        if (window.chrome?.webview) {
            const bridgeClientId = `client_v2_${Math.random().toString(36).substring(2)}${(new Date()).getTime().toString(36)}`;
            window.chrome.webview.hostObjects.sync.bridge.ExecuteMethod("OAuth2Callback", bridgeClientId, [JSON.stringify(message)]);
        } else if ("OAuth2Callback" in window.external) {
            window.external.OAuth2Callback(JSON.stringify(message));
        } else {
            await initializeHost();
            sendPostMessageFunctionOpener({type: "authenticateComplete", ...message});
        }
    };

    /**
     *  Clears the next action. This implicitly disables the button.
     * */
    export const sendClearButton = () => {
        sendPostMessageToParent({type: "clearNext"});
    }

    /**
     * Reports to Templafy that the upload of a document has completed.
     * @param {string} documentLocation the location that is to be opened by templafy. Should be a URL that points to the uploaded document.
     * */
    export const sendUploadComplete = (documentLocation: string) => {
        sendPostMessageToParent({type: "doneUploading", documentLocation});
    };

    /**
     * Reports to Templafy that the page hosted in the iframe is ready to receive the documentURL.
     * This is meant for waiting for user input.
     * @param {Omit<CanUploadMessage, "type">} canUploadMessage
     * */
    export const sendCanUpload = (canUploadMessage: Omit<CanUploadMessage, "type"> = {}) => {
        sendPostMessageToParent({...canUploadMessage, type: "canUpload"});
    };
}

interface ShouldAuthenticateParams {
    /**
     * Whether or not Templafy should show a pop-up to authenticate the user.
     * */
    shouldAuthenticate: boolean;
    /**
     * The URL for the popup that is to be opened.
     * */
    authenticationUrl: string;
}
