import Link from "next/link";

export default function HomeCategoryBar({
  categories,
  activeCategory,
  activeSearch,
}: {
  categories: string[];
  activeCategory?: string;
  activeSearch?: string;
}) {
  const createUrl = (category: string) => {
    const params = new URLSearchParams();

    if (activeSearch) {
      params.set("search", activeSearch);
    }

    if (category !== "All") {
      params.set("category", category);
    }

    const query = params.toString();
    return query ? `/?${query}` : "/";
  };

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex min-w-max gap-3 pb-2">
        <Link
          href={createUrl("All")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !activeCategory || activeCategory === "All"
              ? "bg-black text-white"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          All
        </Link>

        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <Link
              key={category}
              href={createUrl(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              {category}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
