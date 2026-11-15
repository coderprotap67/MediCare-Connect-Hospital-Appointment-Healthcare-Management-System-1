import "./globals.css";
import MyThemeProvider from "@/components/MyThemeProvider";
import AuthProvider from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Hospital Management",
  description: "Healthcare Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 flex flex-col min-h-screen">
        <MyThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 min-w-0 w-full">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </MyThemeProvider>
      </body>
    </html>
  );
}