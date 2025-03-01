import axios from "../api/axios";
import useAuth from "./useAuth";
const LogoutURL = '/users/logout';
const useLogout = () => {
    const { auth, setauth } = useAuth();

    const logout = async () => {
        try {
            const response = await axios.post(LogoutURL,{}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                  },
                withCredentials: true
            });
            setauth({});
            console.log(response.message);
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout