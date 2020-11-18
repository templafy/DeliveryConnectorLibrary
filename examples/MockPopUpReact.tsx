import React, {FunctionComponent} from "react";
import {Templafy} from "@templafy/delivery-connector-library/build";

export const MockPopUpReact: FunctionComponent = () => {
    const sendAuthenticationMessage = (authenticationSuccessful: boolean) => {
        Templafy.sendAuthenticationComplete({authenticationSuccessful, state: "<placeholderstate>"});
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
