const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_NAME;
import axios from "axios";
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const CustomToolTip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const [year, month] = label.split('-');
    const formattedLabel = new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'short', year: 'numeric' });
    return (
      <div style={{padding: '20px'}} className="bg-[#333752] rounded-[4px] text-white flex flex-col items-center justify-center">
        {payload.map((entry) => (
          <p className="flex flex-col items-center justify-center" key={entry.dataKey}>
            <strong>{entry.value} Orders</strong>
            <span>{formattedLabel}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardChart = () => {
  const [ordersWeekly, setOrdersWeekly] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const weeklyURL = `${API_URL}/${ADMIN_ROUTE}/order/weekly`;
    axios.get(weeklyURL)
      .then((res) => {
        if (res.status === 200 && res.data?.data) {
          const rawData = res.data.data;
          // Get last 8 weeks, ending with the next coming week
          let weeks = [];
          // Find the latest week/year in data, or use current week/year
          let lastWeek = 1, lastYear = new Date().getFullYear();
          if (rawData.length > 0) {
            const last = rawData[rawData.length - 1];
            const match = last.week.match(/Week (\d+), (\d+)/);
            if (match) {
              lastWeek = parseInt(match[1]);
              lastYear = parseInt(match[2]);
            }
          } else {
            // If no data, use current week/year
            const now = new Date();
            lastWeek = getWeekNumber(now);
            lastYear = now.getFullYear();
          }
          // Advance to next week
          let nextWeek = lastWeek + 1;
          let nextYear = lastYear;
          if (nextWeek > 52) {
            nextWeek = 1;
            nextYear += 1;
          }
          // Fill 8 weeks ending with next coming week
          for (let i = 8; i >= 0; i--) {
            let week = nextWeek - i;
            let year = nextYear;
            if (week <= 0) {
              week += 52;
              year -= 1;
            }
            const label = `Week ${week}, ${year}`;
            const found = rawData.find(w => w.week === label);
            weeks.push(found || { week: label, totalOrders: 0, totalRevenue: 0 });
          }
          setOrdersWeekly(weeks);
        }
      })
      .catch((err) => console.error("Error fetching weekly orders:", err));
  }, []);

  // Helper to get ISO week number
  function getWeekNumber(date) {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7);
    return weekNo;
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={ordersWeekly} margin={{ top: 0, right: 30, left: -40, bottom: 0 }}>
          <CartesianGrid strokeDasharray="5 5" vertical={true} />
          <XAxis
            dataKey="week"
            axisLine={true}
            tickLine={true}
            tickFormatter={(week) => week.replace(/, \d{4}$/, "")}
            interval={0}
            tick={{ fontSize: 12, fill: "#5A607F" }}
          />
          <YAxis axisLine={true} tickLine={true} />
          <Tooltip />
          {/* <Legend /> */}
          <Line
            key="totalOrders"
            type="monotone"
            dataKey="totalOrders"
            name="Total Orders"
            stroke="#1E5EFF"
            strokeWidth={2}
            dot={false}
          />
          <Line
            key="totalRevenue"
            type="monotone"
            dataKey="totalOrder"
            name="Total Revenue"
            stroke="#A3AED0"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
  