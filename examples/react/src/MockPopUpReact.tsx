import React, {FunctionComponent} from "react";
import {Templafy} from "@templafy/delivery-connector-library";
import { CustomAuthenticationState } from "./CustomAuthenticationState";

export const MockPopUpReact: FunctionComponent = () => {
    const sendAuthenticationSuccess = () => {
        const successfulAuthenticationState: CustomAuthenticationState = {
            isUserAuthenticated: true
        };

        Templafy.sendAuthenticationComplete({authenticationSuccessful: true, state: successfulAuthenticationState});
    };

    const sendAuthenticationFailed = () => {
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
