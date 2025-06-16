import { useEffect, useState } from "react";

const SearchBox = ({ onSelectLocation }) => {
  const [query, setQuery] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(async () => {
      if (query.length > 3) {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`
        );
        const data = await res.json();
        setSearchData(data);
      } else {
        setSearchData([]);
      }
    }, 500); // 500ms delay

    setDebounceTimer(timer);

    return () => clearTimeout(timer); // Clean up
  }, [query]);

  return (
    <div className="my-5">
      <div className="flex gap-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm địa chỉ..."
          className="flex-grow rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>

      {searchData.length > 0 && (
        <ul className="mt-2 bg-white border rounded shadow max-h-60 overflow-y-auto">
          {searchData.map((place, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelectLocation([parseFloat(place.lat), parseFloat(place.lon)]);
                setQuery(place.display_name);
                setSearchData([]);
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
