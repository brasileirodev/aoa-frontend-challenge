function originFromUrl(value: string | null) {
  if (!value) return "";

  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

export function getRequestOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) return origin;

  const refererOrigin = originFromUrl(request.headers.get("referer"));
  if (refererOrigin) return refererOrigin;

  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
    return forwardedProto + "://" + forwardedHost;
  }

  const host = request.headers.get("host");
  if (host) return new URL(request.url).protocol + "//" + host;

  return new URL(request.url).origin;
}
