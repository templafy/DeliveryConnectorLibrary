import React, {FunctionComponent} from "react";
import {Templafy} from "@templafy/delivery-connector-library";
import { CustomAuthenticationState } from "./CustomAuthenticationState";

export const MockPopUpReact: FunctionComponent = () => {
    const sendAuthenticationSuccess = () => {
        const successfulAuthenticationState: CustomAuthenticationState = {
            isUserAuthenticated: true
        };

        // Let Templafy know that authentication was successful and pass along authentication state
        Templafy.sendAuthenticationComplete({authenticationSuccessful: true, state: successfulAuthenticationState});
    };

    const sendAuthenticationFailed = () => {
        // Let Templafy know that authentication was unsuccessful and pass along error information
        Templafy.sendAuthenticationComplete({authenticationSuccessful: false, state: "<placeholderstate>"});
    };

    return (
        <>
            <h1>Hello from Popup</h1>
            <button
                onClick={sendAuthenticationSuccess}
            >
                Authentication succeeded
            </button>
            <button
                onClick={sendAuthenticationFailed}
            >
                Authentication failed
            </button>
        </>
    );
};
