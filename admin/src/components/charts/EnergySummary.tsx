interface Props {
  summary: {
    yield: number;
    consumption: number;
    fromPV: number;
    fromGrid: number;
    feedToGrid: number;
  };
}

export default function EnergySummary({ summary }: Props) {

  return (
    <div className="grid grid-cols-2 gap-6">

      <div>
        <div className="text-sm text-gray-500">Yield</div>

        <div className="text-lg font-semibold">
          {summary.yield} MWh
        </div>

        <div className="flex justify-between text-xs mt-2 text-gray-500">
          <span>Consumed: {summary.fromPV} MWh</span>
          <span>Feed to grid: {summary.feedToGrid} kWh</span>
        </div>
      </div>

      <div>
        <div className="text-sm text-gray-500">Consumption</div>

        <div className="text-lg font-semibold">
          {summary.consumption} MWh
        </div>

        <div className="flex justify-between text-xs mt-2 text-gray-500">
          <span>From PV: {summary.fromPV} MWh</span>
          <span>From Grid: {summary.fromGrid} MWh</span>
        </div>
      </div>

    </div>
  );
}