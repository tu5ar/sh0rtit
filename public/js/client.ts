//add event lister to button
const shortButton = document.getElementById("short-button");
if (shortButton) {
    shortButton.addEventListener("click", askServer);
}

async function askServer(): Promise<string | undefined> {
    const END_POINT = "/api/new";
    const payload = getPayload();
    if (!payload) {
        return;
    }
    try {
        const serverResponse = await fetch(END_POINT, payload)
        const newLink = await serverResponse.text();
        if (newLink) {
            showShortLink(newLink);
        }
    } catch (error) {
        console.log(error);
    }
}

function showShortLink(link: string): void {
    const newLinkHeader = document.getElementById("new-link");
    const webDomain = window.location.hostname;
    if (newLinkHeader) {
        newLinkHeader.textContent = "Short link: " + webDomain + "/api/" + link;
    }
}

function getUserInput(): string | null {
    const input = document.getElementById("user-input") as HTMLInputElement;
    if (input) {
        return input.value;
    }
    return null;
}

function getPayload(): RequestInit | null {
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
