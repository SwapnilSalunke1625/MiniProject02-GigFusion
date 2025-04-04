import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie'

const GetLocation = () => {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [error, setError] = useState("");

    const sendLocationToServer = async (location) => {
        try {
            // console.log(`Bearer: ${Cookies.get('accessToken')}`);
            const response = await axios.post("http://localhost:8000/api/v1/users/location", location, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get('accessToken')}`
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error("Error sending location to the server:", error);
        }
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    console.log("Latitude:", latitude, "Longitude:", longitude);
                    sendLocationToServer({ lat: latitude, lng: longitude });
                },
                (err) => {
                    setError(err.message || "Unable to retrieve location");
                }
            );
        } else {
            setError("Geolocation is not supported by your browser");
        }
    };

    useEffect(() => {
        getUserLocation();
    });

    return (
        <div>
            {location.lat && location.lng && (
                <p>
                    Latitude: {location.lat}, Longitude: {location.lng}
                </p>
            )}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default GetLocation;