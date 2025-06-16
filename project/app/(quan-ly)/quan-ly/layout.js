import { Lexend } from "next/font/google";
import SideBar from "@/components/admin_page/SideBar";
import "../../globals.css";

const lexendMedium = Lexend({
  subsets: ["latin"],
  weight: "500",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lexendMedium.className} antialiased bg-neutral-50`}>
        <SideBar />
        <div className="ml-24">
          {children}
        </div>
      </body>
    </html>
  );
}
