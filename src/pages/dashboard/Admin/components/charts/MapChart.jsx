import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { scaleQuantile } from "d3-scale"

// You'll need to download the Nigeria GeoJSON file and place it in the public folder
const geoUrl = "/nigeria-states.json"

export const MapChart = ({ title, data }) => {
  const colorScale = scaleQuantile()
    .domain(data.map(d => d.value))
    .range([
      "#ffedea",
      "#ffcec5",
      "#ffad9f",
      "#ff8a75",
      "#ff5533",
      "#e2492d",
      "#be3d26",
      "#9a311f",
      "#782618"
    ])

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ComposableMap projectionConfig={{ scale: 1000 }} width={400} height={300}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const d = data.find(s => s.id === geo.id)
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={d ? colorScale(d.value) : "#EEE"}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}

