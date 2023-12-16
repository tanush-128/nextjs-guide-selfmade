import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/provider/AuthProvider";
import { ChatRoomsContextProvider } from "@/context/MessageContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ChatRoomsContextProvider>{children}</ChatRoomsContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
