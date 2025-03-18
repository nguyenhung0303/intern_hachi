
import AuthProvider from "@/components/context/AuthContext";
import Layout from "@/components/admin/layout"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ToastContainer></ToastContainer>
                <AuthProvider>
                    <Layout>

                        {children}
                    </Layout>
                </AuthProvider>
            </body>
        </html>
    );
}