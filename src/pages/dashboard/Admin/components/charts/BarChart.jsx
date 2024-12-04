import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const BarChart = ({ title, data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={150}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

