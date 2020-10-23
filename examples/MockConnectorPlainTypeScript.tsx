import React, {FunctionComponent, useEffect, useState} from "react";
import {Templafy} from "@templafy/delivery-integration-library/build";

export const MockConnectorPlainTypeScript: FunctionComponent = () => {
    const [authenticationState, setAuthenticationState] = useState<unknown | null>(null);

    useEffect(() => {
        void initialize();
    }, [])

    async function initialize() {
        const {authenticationState} = await Templafy.initialize({
            shouldAuthenticate: true,
            authenticationUrl: "https://templafy.templafy-local.com/ui/integrations/playground/mock-connector-imperative/login",
        });
        setAuthenticationState(authenticationState);
    }

    async function setIsReady() {
        Templafy.sendCanUpload({canUpload: true});
        const documentUrl = await Templafy.getDocumentUrl();
        // Perform some action to save the document to custom system.
        Templafy.uploadComplete("https://LOCATION_OF_DOCUMENT");
    }

    return (
        <>
            <h1>Hello from the Imperative Mock Connector</h1>
            <button onClick={() => setIsReady()}>
                Select options
            </button>
        </>
    );
};
