import Layout from "@/components/Layout";
import "@/css/style.css";
import "@/css/reset.css";
import "@/css/responsive.css";
import AuthProvider from "@/components/context/AuthContext";

export default function RootLayout({ children }) {
  return (


    <AuthProvider>
      <Layout>
        {children}
      </Layout>
    </AuthProvider>


  );
}
