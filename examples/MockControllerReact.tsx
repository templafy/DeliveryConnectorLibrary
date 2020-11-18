import React, {FunctionComponent, useEffect} from "react";
import {useDocumentLink, useInitialize} from "@templafy/delivery-connector-library/build/react";
import {useOptions} from "@templafy/delivery-connector-library/build/react";
import {Templafy} from "@templafy/delivery-connector-library/build";

export const MockControllerReact: FunctionComponent = () => {
    const {authenticationState, isInitialized} = useInitialize();
    const {documentLink} = useDocumentLink();

    useEffect(() => {
        if(!isInitialized){
            return;
        }
        Templafy.sendShouldAuthenticate({
            shouldAuthenticate: true,
            authenticationUrl: "https://www.example.com/templafy-connector/login"
        });
    }, [isInitialized])

    const reportReady = () => {
        Templafy.sendCanUpload({canUpload: true});
    }

    if (documentLink) {
        // Perform some action to save the document to custom system.
        Templafy.sendUploadComplete("https://LOCATION_OF_DOCUMENT");
    }

    return (
        <>
            <h1>Hello from the Mock Controller</h1>
            <button onClick={() => reportReady()}> Select options</button>
        </>
    );
};
