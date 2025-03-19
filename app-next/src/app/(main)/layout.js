import Layout from "@/components/Layout";
import "@/css/style.css";
import "@/css/reset.css";
import "@/css/responsive.css"
import AuthProvider from "@/components/context/AuthContext";

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>ShopCo</title>
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
