import { useRef, useEffect } from "react";
import * as d3 from "d3";

// Data must be pre-processed before being input into LineGraph
export default function LineGraph({
  marginTop = 50,
  marginRight = 50,
  marginBottom = 50,
  marginLeft = 50,
  width = 1000,
  height = 1000,
  data,
}) {
  const svgRef = useRef(d3.create("svg"));
  useEffect(() => {
    d3.select(svgRef.current);
  }, [svgRef]);

  const dateData = data.map((datum) => new Date(datum["Date"]));
  const x = d3.scaleTime(
    [d3.min(dateData), d3.max(dateData)],
    [marginLeft, width]
  );

  const emissionData = data.map((datum) => parseFloat(datum["Emissions"]));
  const y = d3.scaleLinear(
    [d3.min(emissionData), d3.max(emissionData)],
    [height - marginBottom, marginTop]
  );

  return <svg ref={svgRef} />;
}
