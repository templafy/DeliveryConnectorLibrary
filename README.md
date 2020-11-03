# Templafy Delivery Connector Library
This library was created to allow external vendors to integrate custom delivery options for documents created within Templafy.
This will allow Templafy users to authenticate with, choose a save location in, and save created documents directly to an external system.

## Usage
A delivery connector always consists of two parts.

- **Delivery Controller**
A page hosted within an iframe on the delivery step of a Templafy document creation flow.
This can be used to ask the user for additional input and to execute logic to save the document to a custom location.

- **Authentication popup**
A pop-up that points to a custom sign-in URL.
This can be used to ask the user to login and is able to pass some arbitrary state to the Delivery Controller.

Examples can be found under [Examples](./examples)

## Caveats
All content must be served over HTTPS.

### Authentication popup
* The popup must start on a URL from the same origin as the Controller.
* The `SendAuthenticationComplete` call must come from the same origin as the popup was opened at.

### Delivery Controller
* The Delivery Controller will be hosted in an iframe with sandbox attribute value `allow-scripts allow-forms allow-same-origin`.
* The Controller will be hosted on a page with the `CSP` directive `frame-src` set to the origin of the `BaseURL`  specified in your Custom Delivery Connector settings.
This means that the controller cannot navigate outside of the original origin.
