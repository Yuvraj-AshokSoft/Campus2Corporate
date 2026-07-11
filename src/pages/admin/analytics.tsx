const cards = [
  {
    title: "Total Students",
    value: "18,420",
  },
  {
    title: "Placement Rate",
    value: "89%",
  },
  {
    title: "Companies",
    value: "126",
  },
  {
    title: "Recruiters",
    value: "842",
  },
];

const Analytics = () => {
  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Analytics Dashboard
        </h1>

        <p className="text-slate-500">
          Platform performance overview.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => (

          <div
            key={card.title}
            className="rounded-xl bg-white p-6 shadow"
          >

            <p className="text-slate-500">
              {card.title}
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {card.value}
            </h2>

          </div>

        ))}

      </div>

      <div className="rounded-xl bg-white p-10 shadow">

        <h2 className="mb-4 text-xl font-bold">
          Monthly Analytics
        </h2>

        <div className="flex h-80 items-center justify-center rounded bg-slate-100">

          Chart goes here

        </div>

      </div>

    </div>
  );
};

export default Analytics;