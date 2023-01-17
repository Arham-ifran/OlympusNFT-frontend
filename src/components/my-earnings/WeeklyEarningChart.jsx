import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";


export default function WeeklyEarningChart(props) {
  const [chartData, setChartData] = useState([])
  let Data = [
    { weekDay: "Monday", sales: 0 },
    { weekDay: "Tuesday", sales: 0 },
    { weekDay: "Wednesday", sales: 0 },
    { weekDay: "Thursday", sales: 0 },
    { weekDay: "Friday", sales: 0 },
    { weekDay: "Saturday", sales: 0 },
    { weekDay: "Sunday", sales: 0 }
  ]

  useEffect(() => {
    let newArr = []
    if (props.data && props.data.length > 0) {
      Data.map((value, index) => {
        let currentIndex = props.data.findIndex(x => x.weekDay === value.weekDay);
        if (currentIndex === -1) {
          newArr.push(value)
        } else {
          newArr.push(props.data[currentIndex])
        }
      })
    }
    setChartData(newArr)
  }, [props.data])


  return (
    <>
      <div >
        <b className='mb-5'>Weekly Sales</b>
        <BarChart
          width={650}
          height={450}
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 5
          }}
        >
          {/* <CartesianGrid strokeDasharray="6 1" /> */}
          <XAxis dataKey="weekDay" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" />
        </BarChart>
      </div>
    </>
  );
}
