const UserDetails = () => {
    const user = {
      name: "Khushbu",
      email: "khushbu@example.com",
      location: "India",
    };
  
    return (
      <div className="user-details">
        <h3>User Details</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Location: {user.location}</p>
      </div>
    );
  };
  
  export default UserDetails;
  