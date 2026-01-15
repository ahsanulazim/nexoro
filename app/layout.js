import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import 'react-quill-new/dist/quill.snow.css';
import MyProvider from "@/context/MyProvider";
import { Bounce, ToastContainer } from "react-toastify";
import QueryProvider from "@/query/QueryProvider";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, SplitText);

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
      </body>
    </html>
  );
}
