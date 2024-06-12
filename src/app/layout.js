import "bootstrap/dist/css/bootstrap.css";
import "@/assets/scss/comman.scss";
import "@/assets/scss/custom.scss";
import localFont from "next/font/local";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";

const monteserrat = localFont({
  src: "../assets/fonts/Montserrat-Regular.ttf",
  display: "swap",
});

export const metadata = {
  title: "myqubator",
  description: "a step towards infinite possibilities",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={monteserrat.className}>
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
