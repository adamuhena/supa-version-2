import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'

export const TreemapChart = ({ title, data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <Treemap
          data={data}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#fff"
          fill="#8884d8"
        >
          <Tooltip />
        </Treemap>
      </ResponsiveContainer>
    </div>
  )
}

