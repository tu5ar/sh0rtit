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
    const END_POINT = "/api/new";
    const payload = getPayload();
    if (!payload) {
        return;
    }
    try {
        const serverResponse = await fetch(END_POINT, payload);
        const newLink = await serverResponse.text();
        if (newLink) {
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}

async function getAllLinks(): Promise<void> {
    const END_POINT = "/init/";
    const response = await fetch(END_POINT);
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
        let shortLinkBuilder = `https://${webDomain}`;
        if (isLocalHost) {
            shortLinkBuilder += ":3000";
        }
        shortLinkBuilder += `/api/${short_link}`;
        li.textContent = `Long link: ${long_link}, Short link: ${shortLinkBuilder}`;
        const copyBtn = document.createElement("button")
        copyBtn.textContent = "Copy";
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(shortLinkBuilder)
                .then(() => {
                    copyBtn.textContent = "Copied!";
                    setTimeout(() => {
                        copyBtn.textContent = "Copy";
                    }, 1500);
                })
                .catch(err => console.log("Failed copy err: ", err));
        });
        linksList.appendChild(li);
        linksList.appendChild(copyBtn);
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



