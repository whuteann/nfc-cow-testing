import * as Realm from "realm-web";

const NEXT_PUBLIC_REALM_ID = process.env.NEXT_PUBLIC_REALM_ID

declare global {
  var realm: any;
}

if (!NEXT_PUBLIC_REALM_ID) {
  throw new Error(
    'Please define the REALM ID environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.realm;

if (!cached) {
  cached = global.realm;
}

export async function connectToRealm() {
  if (cached) {
    return cached;
  }

  const realm: Realm.App = await new Realm.App(NEXT_PUBLIC_REALM_ID!);
  cached = await realm;

  return cached;
}