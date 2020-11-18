import {getSendPostMessageFunction, getPostMessageAwaiter} from "./MessagePassings";

export const sendPostMessageToParent = getSendPostMessageFunction(window.parent);
export const sendPostMessageFunctionOpener = getSendPostMessageFunction(window.opener);

const wildcardSendPostMessageFunctionOpener = getSendPostMessageFunction(window.opener, () => "*");
const wildcardSendPostMessageFunctionParent = getSendPostMessageFunction(window.parent, () => "*");

export async function initializeHost() {
    wildcardSendPostMessageFunctionOpener({type: "initialize"});
    wildcardSendPostMessageFunctionParent({type: "initialize"});
    await waitForPostMessage("acknowledge", 200_000);
}

export const waitForPostMessage = getPostMessageAwaiter();
