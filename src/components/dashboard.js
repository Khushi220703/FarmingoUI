import React from "react";
import Weather from "./weather";
import PurcahseBar from "./purchaseBar";
import BuyOrderDetails from "./buyOrderDetails";
import RentalsTable from "./rentOrderDetails";
import RentedItemsTable from "./rentedItem";
import UserRentedItemsTable from "./youRented";
import Tools from "./recommendations/chemicalAndPrice";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Weather />
      <Tools />
      <PurcahseBar />
      <BuyOrderDetails />
      
        <RentalsTable />
        <RentedItemsTable />
        <UserRentedItemsTable />
     d
    </div>
  );
};

export default Dashboard;
