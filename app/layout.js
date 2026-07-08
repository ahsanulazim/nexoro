import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import "react-quill-new/dist/quill.snow.css";
import MyProvider from "@/context/MyProvider";
import { Bounce, ToastContainer } from "react-toastify";
import QueryProvider from "@/query/QueryProvider";
import { GoogleTagManager } from "@next/third-parties/google";
import FacebookPixel from "@/components/FacebookPixel";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nexoro Solution",
  description: "Your Vision, Our Solution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      <body
        className={`${spaceGrotesk.variable} font-space-grotesk antialiased`}
      >
        <QueryProvider>
          <MyProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Bounce}
            />
            {children}
          </MyProvider>
        </QueryProvider>
        <FacebookPixel />
      </body>
    </html>
  );
}
