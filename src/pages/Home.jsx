import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Footer from "../components/Footer/Footer";
import PackageCard from "../components/PackageCard/PackageCard";

const packages = [
  {
    id: 1,
    title: "Dubai Luxury Tour",
    price: "$1,200",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  },
  {
    id: 2,
    title: "Zanzibar Beach Holiday",
    price: "$950",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
];

function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      <section className="py-16 px-6">
        <h2 className="text-4xl font-bold text-center mb-10">
          Featured Packages
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;