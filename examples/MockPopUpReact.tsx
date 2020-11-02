import React, {FunctionComponent} from "react";
import {sendAuthenticationComplete} from "@templafy/delivery-connector-library/build/react";

export const MockPopUpReact: FunctionComponent = () => {
    const sendAuthenticationMessage = (authenticationSuccessful: boolean) => {
        sendAuthenticationComplete({authenticationSuccessful, state: "<placeholderstate>"});
    };

    return (
        <>
            <h1>Hello from Popup</h1>
            <button
                onClick={() => sendAuthenticationMessage(true)}
            >
                Authentication succeeded
            </button>
            <button
                onClick={() => sendAuthenticationMessage(false)}
            >
                Authentication failed
            </button>
        </>
    );
};
