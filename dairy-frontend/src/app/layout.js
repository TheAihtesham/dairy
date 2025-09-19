import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "Dairy Management",
  description: "Desktop Web App for Dairy Shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex overflow-y-hidden">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 min-h-screen overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
