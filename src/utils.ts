import { createHash } from "crypto";

export function shortHash(longLink: string): string {
    return createHash("sha256")
        .update(longLink)
        .digest("hex")
        .slice(0, 6);
}

function normaliseInput(input: string): string | void {
    const MIN_LEN = 3;
    const MAX_LEN = 248;
    const HTTP_PROTOCOL = "http://";
    const HTTPS_PROTOCOL = "https://"
    if (input.length < MIN_LEN || input.length > MAX_LEN || input.includes(".") !== true) {
        return;
    }

    if (input.includes(":") && !input.startsWith(HTTP_PROTOCOL) && !input.startsWith(HTTPS_PROTOCOL)) {
        return;
    }

    input = input.toLowerCase();
    if (input.startsWith(HTTP_PROTOCOL) || input.startsWith(HTTPS_PROTOCOL)) {
        return input;
    }
    return HTTPS_PROTOCOL + input;
}

export function validateInput(input: string): string | void {
    const normalisedInput = normaliseInput(input);
    if (typeof normalisedInput !== "string") {
        return;
    }
    try {
        const url = new URL(normalisedInput);
        if (url.hostname.startsWith("www.")) {
            const parsedLink = url.protocol + "//" + url.hostname + url.pathname + url.search + url.hash;
            return parsedLink;
        } else {
            const parsedLink = url.protocol + "//www." + url.hostname + url.pathname + url.search + url.hash;
            return parsedLink;
        }
    } catch {
        return;
    }

}
