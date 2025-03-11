
import AuthProvider from "@/components/context/AuthContext";
import Layout from "@/components/admin/layout"

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