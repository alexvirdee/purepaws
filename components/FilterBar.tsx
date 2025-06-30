'use client';

export default function FilterBar({
    selectedBreed,
    setSelectedBreed,
}: {
    selectedBreed: string;
    setSelectedBreed: (value: string) => void;
}) {
    return (
        <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 backdrop-blur-md border border-gray-200 rounded shadow p-4 w-64">
        <h2 className="text-lg font-semibold mb-2">Find Your Breeder</h2>
        <input
          type="text"
          placeholder="Search name or city..."
          className="w-full p-2 border rounded mb-2"
        />
        <select 
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className="w-full p-2 border rounded"
        >
          <option value="All">All Breeds</option>
          <option>Golden Retriever</option>
          <option>German Shepherd</option>
          <option>English Springer Spaniel</option>
        </select>
      </div>
    )
}