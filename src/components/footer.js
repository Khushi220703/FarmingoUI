import React from 'react'
import "../stylesheet/footer.css"

const footer = () => {
  const footer = {
     backgroundColor: "yellow",
     color:"red",
  }
// this is name varibale.
  const name = "khushbu Jha"
  
  return (
    <div>
      
       <div style={{backgroundColor:"pink", color:"aliceblue"}}>Hello brother!</div>
       <p style={footer}>Hello from this side</p>
       <p className="name" >Khushi</p>
       <p>{name}</p>
       <img src="" />
    </div>
  )
}

export default footer
