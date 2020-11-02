import React, {FunctionComponent} from "react";
import {Templafy} from "@templafy/delivery-connector-library";

export const MockPopUpPlaintTypeScript: FunctionComponent = () => {
    const sendAuthenticationMessage = (authenticationSuccessful: boolean) => {
        Templafy.sendAuthenticationComplete({authenticationSuccessful, state: "<placeholderstate>"});
    };

    return (
        <>
            <h1>Hello from Pop up</h1>
            <button
                onClick={() => sendAuthenticationMessage(true)}
            />

            <button
                onClick={() => sendAuthenticationMessage(false)}
            />
        </>
    );
};
