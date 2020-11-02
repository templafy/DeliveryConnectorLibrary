import React, {FunctionComponent, useEffect} from "react";
import {useDocumentLink, useInitialize} from "@templafy/delivery-connector-library/build/react";
import {useOptions} from "@templafy/delivery-connector-library/build/react";

export const MockControllerReact: FunctionComponent = () => {
    const {authenticationState, setAuthenticationNeeded, isInitialized} = useInitialize();
    const {documentLink, uploadComplete} = useDocumentLink();
    const {sendCanUpload} = useOptions();

    useEffect(() => {
        if(!isInitialized){
            return;
        }
        setAuthenticationNeeded({
            shouldAuthenticate: true,
            authenticationUrl: "https://www.example.com/templafy-connector/login"
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
            <h1>Hello from the Mock Controller</h1>
            <button onClick={() => reportReady()}> Select options</button>
        </>
    );
};
