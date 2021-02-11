import { Templafy } from "@templafy/delivery-connector-library";
import { CustomAuthenticationState } from './CustomAuthenticationState';

(async () => {
    await Templafy.initialize();
  
    Templafy.sendShouldAuthenticate({
      shouldAuthenticate: true,
      authenticationUrl: "https://localhost:3000/login.html",
    });
  
    await handleAuthenticationResult();

    await handleDocumentUrl();
})();


async function handleAuthenticationResult() {
    let authenticationState = await Templafy.getAuthenticationState<CustomAuthenticationState>();
  
    while (!authenticationState?.authenticationState?.isUserAuthenticated) {
      authenticationState = await Templafy.getAuthenticationState<CustomAuthenticationState>();
    }
  
    // process/save authenticationState
  
    // Let Templafy know that input is required from the user.
    Templafy.sendRequireInput();
}

async function handleDocumentUrl() {
    let documentUrl = await Templafy.getDocumentUrl();

    // process document

    // Let Templafy know where it can find the document after it has been processed (the user will be redirected to it).
    Templafy.sendUploadComplete("https://LOCATION_OF_DOCUMENT");
}

function handleSelection() {
    // Let Templafy know that the delivery connector is ready to process the document
    Templafy.sendCanUpload({});
}

function clearInput() {
    // Let Templafy know that the delivery connector required input
    Templafy.sendClearButton();
}

(() => {
    const buttonSelectOptions = document.getElementById("buttonSelectOptions");
    buttonSelectOptions?.addEventListener("click", handleSelection);

    const buttonClearInput = document.getElementById("buttonClearInput");
    buttonClearInput?.addEventListener("click", clearInput);
})()