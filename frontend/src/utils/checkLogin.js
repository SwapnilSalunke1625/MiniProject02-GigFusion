import Cookies from "js-cookie";

export default function checkLogin(navigate) {
    if (!Cookies.get("accessToken")) {
        console.log("Access token not found");
        navigate("/login");
    }
    return;
}