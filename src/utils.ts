import { createHash } from "crypto";

export function shortHash(longLink: string): string {
    return createHash("sha256")
        .update(longLink)
        .digest("hex")
        .slice(0, 6);
}
