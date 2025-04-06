import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "../stylesheet/purchaseBar.css";
const {decryptToken} = require("../utils/tokenDecryption");

const MonthlyPurchaseChart = () => {
  const [data,setData] = useState([]);
  const userId = decryptToken();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const fetchData =  async ()  =>{

    try {
       const response = await fetch(`${process.env.REACT_APP_API_URL}api/dashboard/monthlyPurchase/:${userId}`);

       if(response.status === 200){

        const records = await response.json();
        const formattedData = records.map(item => ({
          month: monthNames[item._id.month - 1], // Convert 1-12 to "Jan"-"Dec"
          cost: item.totalSales
        }));
        setData(formattedData);
       }
      
    } catch (error) {
      console.log("There is an error from server side", error);
    }
  }
  useEffect(()=>{

    fetchData();
  },[])
  return (
    <div className="chart-container">
      <h2 className="chart-title">Monthly Item Purchase Cost</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cost" fill="#28a745" barSize={40} radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyPurchaseChart;
