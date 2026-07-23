import Card from "../ui/Card";
import LoadingSkeleton from "../ui/LoadingSkeleton";

export default function InterestList({
  loading = false,
  insights = {},
}) {
  if (loading) {
    return (
      <Card>
        <LoadingSkeleton className="h-64 w-full rounded-xl" />
      </Card>
    );
  }

  const interests =
    insights.topInterests || [];

  return (
    <Card>

      <div className="mb-6">

        <h2 className="text-lg font-semibold">
          Top Interests
        </h2>

        <p className="text-sm text-slate-500">
          Most requested products and services.
        </p>

      </div>

      <div className="space-y-4">

        {interests.length === 0 ? (
          <p className="text-sm text-slate-500">
            No interests recorded.
          </p>
        ) : (
          interests.map(
            (interest, index) => (
              <div
                key={interest}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">

                    {index + 1}

                  </div>

                  <span className="font-medium">
                    {interest}
                  </span>

                </div>

              </div>
            )
          )
        )}

      </div>

    </Card>
  );
}