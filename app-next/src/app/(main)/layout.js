import Layout from "@/components/Layout";
import "@/css/style.css";
import "@/css/reset.css";
import AuthProvider from "@/components/context/AuthContext";

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <body>
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>

  );
}
