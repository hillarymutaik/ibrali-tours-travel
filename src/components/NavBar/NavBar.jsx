import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between">
      <h1 className="text-2xl font-bold text-sky-600">
        Ibrali Tours
      </h1>

      <div className="flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/packages">Packages</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
}

export default Navbar;