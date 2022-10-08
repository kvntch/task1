export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

const DEFAULT_REDIRECT = "/";
export function safeRedirect(
    to: FormDataEntryValue | string | null | undefined,
    defaultRedirect: string = DEFAULT_REDIRECT
  ) {
    if (!to || typeof to !== "string") {
      return defaultRedirect;
    }
  
    if (!to.startsWith("/") || to.startsWith("//")) {
      return defaultRedirect;
    }
  
    return to;
  }

  export async function getUserByEmail(email: string) {
    return {
      id: 1,
      email: email,
      name: 'Hello User'
    }
  }

  export async function getUserWithSession(request: Request) {
    const email = request.headers.get('X-User-Email');
    if (email !== 'test@email.com') {
      return null;
    }

    return {
      id: 1,
      email: 'test@user.com',
      name: 'Hello User'
    }
  }