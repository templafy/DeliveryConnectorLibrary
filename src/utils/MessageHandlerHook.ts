import {useEffect} from "react";
import {getOriginFilteredMessageHandler, PostMessageHandler, PostMessageMessage} from "./MessagePassings";

export const useHandleMessages = <T extends PostMessageMessage>(messageHandler: PostMessageHandler<T>, additionalDependencies: unknown[] = []) => {
    useEffect(() => {
        const originFilteredMessageHandler = getOriginFilteredMessageHandler(messageHandler);
        window.addEventListener("message", originFilteredMessageHandler);
        return () => {
            window.removeEventListener("message", originFilteredMessageHandler);
        };
    }, [messageHandler, ...additionalDependencies]);
};