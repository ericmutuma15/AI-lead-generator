import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import Card from "../ui/Card";
import LoadingSkeleton from "../ui/LoadingSkeleton";

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
];

export default function LeadSources({
  loading = false,
  leads = [],
}) {
  if (loading) {
    return (
      <Card>
        <LoadingSkeleton className="h-80 w-full rounded-xl" />
      </Card>
    );
  }

  const grouped = leads.reduce((acc, lead) => {
    const source = lead.source || "Unknown";

    acc[source] = (acc[source] || 0) + 1;

    return acc;
  }, {});

  const data = Object.entries(grouped).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <Card>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Lead Sources
        </h2>

        <p className="text-sm text-slate-500">
          Where your customers are coming from.
        </p>
      </div>

      <div className="h-80">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      <div className="mt-4 space-y-2">

        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">

              <div
                className="h-3 w-3 rounded-full"
                style={{
                  background:
                    COLORS[
                      index %
                        COLORS.length
                    ],
                }}
              />

              <span className="text-sm">
                {item.name}
              </span>

            </div>

            <span className="font-semibold">
              {item.value}
            </span>

          </div>
        ))}

      </div>

    </Card>
  );
}