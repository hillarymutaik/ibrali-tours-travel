function Hero() {
  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')",
      }}
    >
      <div className="bg-black/50 p-10 rounded-xl text-center text-white">
        <h1 className="text-5xl font-bold mb-4">
          Explore The World With Ibrali Tours
        </h1>

        <p className="text-lg mb-6">
          Affordable adventures and unforgettable memories.
        </p>

        <button className="bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-lg">
          Explore Packages
        </button>
      </div>
    </div>
  );
}

export default Hero;