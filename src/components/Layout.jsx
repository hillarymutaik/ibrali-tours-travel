import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[#F7F4EE] text-[#1C1A17]">
            <Navbar />
            <main className="pt-16 animate-fadeIn">
                {children}
            </main>
            <Footer />
        </div>
    )
}