let timestamp = Date.now();
let digest: string = null!
const requestId = crypto.randomUUID();


export default async function GetHeaderAuth () {
  const now = Date.now()
  if (!digest || now - timestamp > 10000) {
    timestamp = now
    const payload = `${requestId}_${timestamp}`;

    const data = new TextEncoder().encode(payload);

    const hash = await crypto.subtle.digest("SHA-256", data);
    // @ts-ignore
    digest = [...new Uint8Array(hash)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  }
  return {
    Authorization: `Digest ${digest}`,
    "X-Timestamp": String(timestamp),
    "X-Request-Id": requestId,
  }
}