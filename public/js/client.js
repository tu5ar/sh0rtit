"use strict";
//add event lister to button
const shortButton = document.getElementById("short-button");
if (shortButton) {
    shortButton.addEventListener("click", askServer);
}
async function askServer() {
    const END_POINT = "/api/new";
    const payload = getPayload();
    if (!payload) {
        return;
    }
    try {
        const serverResponse = await fetch(END_POINT, payload);
        const newLink = await serverResponse.text();
        if (newLink) {
            showShortLink(newLink);
        }
    }
    catch (error) {
        console.log(error);
    }
}
function showShortLink(link) {
    const newLinkHeader = document.getElementById("new-link");
    const webDomain = window.location.hostname;
    if (newLinkHeader) {
        newLinkHeader.textContent = webDomain + "/api/" + link;
    }
}
function getUserInput() {
    const input = document.getElementById("user-input");
    if (input) {
        return input.value;
    }
    return null;
}
function getPayload() {
    const input = getUserInput();
    if (!input) {
        return null;
    }
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            original_link: input
        })
    };
}
