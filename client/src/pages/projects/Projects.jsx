import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import ProjectCard from "../../components/projectCard/ProjectCard"; // create similar to GigCard

export default function Projects() {
  const [search, setSearch] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: () => newRequest.get("/projects").then((res) => res.data),
  });

  const filtered = data
    .filter((p) => {
      const term = search.toLowerCase();
      const matches =
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term);
      const min = minBudget ? +minBudget : -Infinity;
      const max = maxBudget ? +maxBudget : Infinity;
      return (
        matches &&
        p.budget >= min &&
        p.budget <= max &&
        p.status === "open"
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-full"
          />
          <input
            type="number"
            placeholder="Min $"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
            className="w-24 px-4 py-2 border rounded-full"
          />
          <input
            type="number"
            placeholder="Max $"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            className="w-24 px-4 py-2 border rounded-full"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <p>Loading projects…</p>
        ) : error ? (
          <p>Error loading projects.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length ? (
              filtered.map((proj) => (
                <ProjectCard key={proj._id} project={proj} />
              ))
            ) : (
              <p className="col-span-full text-center">No projects found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
