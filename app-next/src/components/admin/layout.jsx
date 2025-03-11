// "use client";

// import Link from "next/link";
// import "@/css/layoutdash.css";

// export default function Header() {
//     return (
//         <header className="sidebar">
//             <div className="logo">Logo</div>
//             <nav>
//                 <ul className="menu">
//                     <li>
//                         <Link href="/dash/home" className="menu-item">Home</Link>
//                     </li>
//                     <li>
//                         <Link href="/dash/product" className="menu-item">Product</Link>
//                     </li>
//                 </ul>
//             </nav>
//         </header>
//     );
// }
import '@/css/dashlayout.css'
import Header from '@/components/admin/Header'
import React from 'react'

function Layout({ children }) {
    return (
        <>
            <div className='dashboard-layout'>
                <Header />
                <main className='content'>
                    {children}
                </main>
            </div>

        </>
    )
}

export default Layout