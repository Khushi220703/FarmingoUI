import {jwtDecode} from "jwt-decode";

export const decryptToken = () => {
    const token = localStorage.getItem("farmingoToken"); 
   
    
    if (!token) {
        console.warn("No token found in localStorage");
        return null; 
    }

    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.userId; 
    } catch (error) {
        console.error("Invalid or expired token:", error);
        return null; 
    }
};
