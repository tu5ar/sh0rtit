export function FNV_1A(input: string): string {
    const FNV_OFFSET_BASIS = 2166136261;
    const FNV_PRIME = 16777619;
    let hash = FNV_OFFSET_BASIS;
    const bytes = new TextEncoder().encode(input);
    for (const uint8 of bytes) {
        hash = (hash ^ uint8) >>> 0;
        hash = Math.imul(hash, FNV_PRIME) >>> 0;
    }
    //normalises return to length 7 w/ padding and splices last 5 chars
    return hash.toString(36).padStart(7, "0",).slice(-5);
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


