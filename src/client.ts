const NEW_REQUEST_ENDPOINT = "/new/";
const INIT_ENDPOINT = "/init/";
const shortButton = document.getElementById("short-button");

if (shortButton) {
    shortButton.addEventListener("click", askServer);
}

interface SessionLink {
    short_link: string;
    long_link: string;
}

document.addEventListener("DOMContentLoaded", async () => {
    getAllLinks();
});

async function askServer(): Promise<string | undefined> {
    const payload = getPayload();
    if (!payload) {
        return;
    }
    try {
        const serverResponse = await fetch(NEW_REQUEST_ENDPOINT, payload);
        const newLink = await serverResponse.text();
        if (newLink) {
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}

async function getAllLinks(): Promise<void> {
    const response = await fetch(INIT_ENDPOINT);
    if (response.ok) {
        const data = await response.json() as SessionLink[];
        data?.forEach(link => {
            addLinkToDisplay(link.short_link, link.long_link)
        });
    }
}

function addLinkToDisplay(short_link: string, long_link: string): void {
    const linksList = document.getElementById("user-links") as HTMLUListElement;
    const webDomain = window.location.hostname;
    const isLocalHost = webDomain === "localhost" ? true : false;
    if (linksList) {
        const li = document.createElement("li");
        let shortLinkBuilder = `http://${webDomain}`;
        if (isLocalHost) {
            shortLinkBuilder += ":3000";
        }
        shortLinkBuilder += `/${short_link}`;
        li.innerHTML = `Long link: ${long_link}<br>Short link: ${shortLinkBuilder}`;
        const copyBtn = getCopyBtn(shortLinkBuilder);
        linksList.appendChild(li);
        linksList.appendChild(copyBtn);
    }
}

function getCopyBtn(longLink: string): HTMLButtonElement {
    const copyBtn = document.createElement("button");
            copyBtn.textContent = "Copy";
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(longLink)
                .then(() => {
                    copyBtn.textContent = "Copied!";
                    setTimeout(() => {
                        copyBtn.textContent = "Copy";
                    }, 1500);
                })
                .catch(err => console.log("Failed copy err: ", err));
        });
    return copyBtn;
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



