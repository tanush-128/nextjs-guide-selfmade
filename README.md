to get started
```sh
npm i prisma @prisma/client @auth/prisma-adapter next-auth
```

1) create `src/app/api/auth/[...nextauth]/route.ts ` with following code

```typescript
import { authOptions } from "@/utils/auth"
import NextAuth from "next-auth"

const handler =  NextAuth(authOptions)

export {handler as GET, handler as POST }
```
2) create `src/utils/auth.ts` with the following code

```typescript
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./connect";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
};

```
3) create `src/utils/connect.ts` with the following code
```typescript
import { PrismaClient } from "@prisma/client";
const prismaClientSingleton = () => {
  return new PrismaClient();
};
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}
const prisma = globalThis.prisma ?? prismaClientSingleton();
export default prisma;
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
```

4) In terminal
```sh  
npx prisma init --datasource-provider mongodb
```
this creates a schema.prisma file and .env file

5) replace the contents in .env with 
```
GOOGLE_ID = 42552123265-msoo43qqlhvchgc5hpg85iidj9a4eq4e.apps.googleusercontent.com
GOOGLE_SECRET = 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

NEXTAUTH_URL = http://localhost:3000
NEXTAUTH_SECRET = my_secret_2

DATABASE_URL= "mongodb+srv://tanush128:testing128@cluster0.oizobcd.mongodb.net/test_app_2?retryWrites=true&w=majority"
```

6) In the schema.prisma file add
```javascript
model Account {
  id                 String  @id @default(cuid()) @map("_id")
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  
  access_token       String?  
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? 
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid()) @map("_id")
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid()) @map("_id")
  name          String?
  email         String   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
    id         String   @id @default(cuid()) @map("_id")
    identifier String
    token      String   @unique
    expires    DateTime

    @@unique([identifier, token])
}
```
this is the base model that next-auth follows

7) In terminal 
```sh
npx prisma db push
```
```sh
npx prisma generate
```
```sh
npx prisma studio
```






