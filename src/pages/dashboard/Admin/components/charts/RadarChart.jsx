import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

export const RadarChart = ({ title, data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={150}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          <Radar name="Skill" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}

