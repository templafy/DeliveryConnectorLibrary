import React, {FunctionComponent, useEffect} from "react";
import {useDocumentUrl, useInitialize} from "@templafy/delivery-connector-library/react";
import {Templafy} from "@templafy/delivery-connector-library";
import { CustomAuthenticationState } from "./CustomAuthenticationState";

export const MockControllerReact: FunctionComponent = () => {
    const {authenticationState, isInitialized} = useInitialize<CustomAuthenticationState>();
    const {documentUrl} = useDocumentUrl();

    useEffect(() => {
        if(!isInitialized){
            return;
        }

        // Let Templafy know the user needs to authenticate.
        Templafy.sendShouldAuthenticate({
            shouldAuthenticate: true,
            authenticationUrl: "https://localhost:3000/login"
        });
    }, [isInitialized]);

    useEffect(() => {
        if(!isInitialized || !authenticationState?.authenticationState?.isUserAuthenticated){
            return;
        }

        // Let Templafy know that input is required from the user.
        Templafy.sendRequireInput();
    }, [isInitialized, authenticationState]);

    useEffect(() => {
        if(!isInitialized || !documentUrl){
            return;
        }

        // process document

        // Let Templafy know where it can find the document after it has been processed (the user will be redirected to it).
        Templafy.sendUploadComplete("https://LOCATION_OF_DOCUMENT");
    }, [isInitialized, documentUrl]);

    const reportReady = () => {
        // Let Templafy know that the delivery connector is ready to process the document
        Templafy.sendCanUpload({});
    }

    const clearInput = () => {
        // Let Templafy know that the delivery connector required input
        Templafy.sendClearButton();
    }

    return (
        <>
            <h1>Hello from the Mock Controller</h1>
            <button onClick={reportReady}>Select options</button>
            <button onClick={clearInput}>Clear input</button>
        </>
    );
};
