import React, {FunctionComponent, useEffect} from "react";
import {useDocumentLink, useInitialize} from "@templafy/delivery-integration-library/build/react";
import {useOptions} from "@templafy/delivery-integration-library/build/react";

export const MockConnectorReact: FunctionComponent = () => {
    const {authenticationState, setAuthenticationNeeded, isInitialized} = useInitialize();
    const {documentLink, uploadComplete} = useDocumentLink();
    const {sendCanUpload} = useOptions();

    useEffect(() => {
        if(!isInitialized){
            return;
        }
        setAuthenticationNeeded({
            shouldAuthenticate: true,
            authenticationUrl: "https://templafy.templafy-local.com/mock-connector/login"
        });
    }, [isInitialized, setAuthenticationNeeded])


    const reportReady = () => {
        sendCanUpload({canUpload: true});
    }

    if (documentLink) {
        // Perform some action to save the document to custom system.
        uploadComplete("https://LOCATION_OF_DOCUMENT");
    }

    return (
        <>
            <h1>Hello from the Mock Connector</h1>
            <button onClick={() => reportReady()}> Select options</button>
        </>
    );
};
