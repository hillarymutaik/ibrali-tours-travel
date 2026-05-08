import { Link } from "react-router-dom";

function PackageCard({ pkg }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <img
        src={pkg.image}
        alt={pkg.title}
        className="h-60 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="text-2xl font-semibold">{pkg.title}</h3>

        <p className="text-sky-600 font-bold mt-2">{pkg.price}</p>

        <Link to={`/packages/${pkg.id}`}>
          <button className="mt-4 bg-sky-500 text-white px-4 py-2 rounded">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

export default PackageCard;