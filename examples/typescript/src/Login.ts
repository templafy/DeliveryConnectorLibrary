import { Templafy } from '@templafy/delivery-connector-library';
import { CustomAuthenticationState } from './CustomAuthenticationState';

export function sendAuthenticationSuccess() {
    const successfulAuthenticationState: CustomAuthenticationState = {
        isUserAuthenticated: true
    };

    // Let Templafy know that authentication was successful and pass along authentication state
    Templafy.sendAuthenticationComplete({ authenticationSuccessful: true, state: successfulAuthenticationState });
};

export function sendAuthenticationFailed() {
    // Let Templafy know that authentication was unsuccessful and pass along error information
    Templafy.sendAuthenticationComplete({ authenticationSuccessful: false, state: "<placeholderstate>" });
};

(() => {
    const buttonSucceedAuthentication = document.getElementById("buttonSucceedAuthentication");
    buttonSucceedAuthentication?.addEventListener("click", sendAuthenticationSuccess);

    const buttonFailAuthentication = document.getElementById("buttonFailAuthentication");
    buttonFailAuthentication?.addEventListener("click", sendAuthenticationFailed);
})()