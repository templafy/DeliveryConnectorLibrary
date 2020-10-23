import React, {FunctionComponent} from "react";
import {sendAuthenticationComplete} from "@templafy/delivery-integration-library/build/react";

export const MockPopUpReact: FunctionComponent = () => {
    const sendAuthenticationMessage = (authenticationSuccessful: boolean) => {
        sendAuthenticationComplete({authenticationSuccessful, state: "<placeholderstate>"});
    };

    return (
        <>
            <h1>Hello from Pop up</h1>
            <button
                onClick={() => sendAuthenticationMessage(true)}
            />
            ./src/playground/DeliveryIntegration/MockConnectorReact.tsx
            <button
                onClick={() => sendAuthenticationMessage(false)}
            />
        </>
    );
};
