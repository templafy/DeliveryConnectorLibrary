import React, {FunctionComponent, useEffect, useState} from "react";
import {Templafy} from "@templafy/delivery-connector-library/build";

export const MockControllerPlainTypeScript: FunctionComponent = () => {
    const [authenticationState, setAuthenticationState] = useState<unknown | null>(null);

    useEffect(() => {
        (async () => {
            await Templafy.initialize();
            Templafy.sendShouldAuthenticate({
                shouldAuthenticate: true,
                authenticationUrl: "https://www.example.com/templafy-connector/login"
            });
            await handleAuthenticationResult()
        })();
    }, [])

    const handleAuthenticationResult = async () => {
        let authenticationState = await Templafy.getAuthenticationState();
        while (!authenticationState.authenticationSuccessful) {
            authenticationState = await Templafy.getAuthenticationState();
        }
        setAuthenticationState(authenticationState);
    }

    async function setIsReady() {
        Templafy.sendCanUpload({});
        await Templafy.getDocumentUrl();
        // Perform some action to save the document to custom system.
        Templafy.sendUploadComplete("https://LOCATION_OF_DOCUMENT");
    }

    return (
        <>
            <h1>Hello from the Imperative Mock Controller</h1>
            <button onClick={() => setIsReady()}>
                Select options
            </button>
        </>
    );
};
