import {getPromiseAndResolver, getPromiseRejectedAfter} from "./PromiseUtils";
import {updateRelationship, getValidOriginRegExp, windowMap} from "./GlobalVars";

export type PostMessageHandler<T extends PostMessageMessage> = (ev: TemplafyMessageEvent<T>) => void;

export interface AcknowledgeMessage {
    type: "acknowledge";
}

export interface AuthenticateCompleteMessage {
    type: "authenticateComplete";
    state: unknown;
    authenticationSuccessful: boolean;
}

export interface CanUploadMessage {
    type: "canUpload";
    locationDisplayName?: string;
}

export interface ClearNextMessage {
    type: "clearNext"
}

export interface DoneUploadingMessage {
    type: "doneUploading";
    documentLocation: string;
}

export interface DeliverDocumentMessage {
    type: "deliverDocument";
    documentUrl: string;
}

export interface InitializeMessage {
    type: "initialize";
}

export interface RequireInputMessage {
    type: "requireInput";
}

export type ShouldAuthenticateMessage = {
    type: "shouldAuthenticate";
    shouldAuthenticate: false;
} | {
    type: "shouldAuthenticate";
    authenticationUrl: string;
    shouldAuthenticate: true;
};

export type PostMessageMessage =
    | AcknowledgeMessage
    | AuthenticateCompleteMessage
    | CanUploadMessage
    | ClearNextMessage
    | DeliverDocumentMessage
    | DoneUploadingMessage
    | InitializeMessage
    | RequireInputMessage
    | ShouldAuthenticateMessage
    ;

export const getSendPostMessageFunction = (
    targetWindow: Window | undefined,
    getOrigin: () => string | undefined = () => (targetWindow && windowMap.get(targetWindow))
) =>
    (message: PostMessageMessage) => {
        const origin = getOrigin();
        if (!origin) {
            throw new Error("Call initialize before sending message.");
        }
        if (targetWindow) {
            targetWindow.postMessage(message, origin);
        }
    };

export const getOriginFilteredMessageHandler = <T extends PostMessageMessage>(postMessageHandler: PostMessageHandler<T>) =>
    (event: WindowEventMap["message"]) => {
        const validOriginRegExp = getValidOriginRegExp();
        if (!validOriginRegExp.test(event.origin)) {
            return;
        }
        updateRelationship(event.source, event.origin);
        postMessageHandler(event);
    };

export const getPostMessageAwaiter = () =>
    <T extends PostMessageMessage>(type: PostMessageMessage["type"], timeoutMs: number): Promise<T> => {
        const [promise, resolver] = getPromiseAndResolver<T>();

        const messageEventHandler = getOriginFilteredMessageHandler<T>(({data}) => {
            if (data.type !== type) {
                return;
            }
            resolver(data);
        });

        window.addEventListener("message", messageEventHandler);

        const timeoutPromise = getPromiseRejectedAfter<T>(timeoutMs);
        const result = Promise.race([promise, timeoutPromise]);

        result.finally(() => {
            window.removeEventListener("message", messageEventHandler);
        });

        return result;
    };

interface TemplafyMessageEvent<T extends PostMessageMessage> extends MessageEvent {
    data: T;
}
