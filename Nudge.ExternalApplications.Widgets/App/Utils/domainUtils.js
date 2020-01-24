export function extractRelevantDomain(domainWithHost) {
    if (!domainWithHost) {
        return "";
    }
    const [domainOnly] = domainWithHost.match(/^(?:https?:\/\/)?(?:[^@/\n]+@)?(?:www\.)?([^:/?\n]+)/igm);
    const domainParts = domainOnly.split("://");
    const last = domainParts[Math.max(domainParts.length - 1, 0)] || "";
    return last.replace("www.", "");
}