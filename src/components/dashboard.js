import React from 'react'
import Weather from './weather'
import PurcahseBar from "./purchaseBar"
import BuyOrderDetails from "./buyOrderDetails"
import RentalsTable from './rentOrderDetails'
import RentedItemsTable from './rentedItem'
import UserRentedItemsTable from "./youRented"
import Tools from "./recommendations/chemicalAndPrice"
const dashboard = () => {
  return (
    <div>
      <Weather />
      <Tools/>
      <PurcahseBar/>
      <BuyOrderDetails/>
      <RentalsTable/>
      <RentedItemsTable/>
      <UserRentedItemsTable/>
    </div>
  )
}

export default dashboard
