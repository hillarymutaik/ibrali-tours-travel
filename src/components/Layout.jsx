import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-white to-blue-50 text-gray-900">
            <Navbar />
            <main className="pt-16 animate-fadeIn">
                {children}
            </main>
            <Footer />
        </div>
    )
}