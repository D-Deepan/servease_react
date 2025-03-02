import axios from '../api/axios';
import useAuth from './useAuth';


//  FOLLOWING IMPLIES ----LOCALSTORAGE----

/*const useRefreshToken = () => {
  const { setauth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get('/users/refresh', {
        withCredentials: true,
      });

      // Update auth state and localStorage
      setauth((prev) => {
        const newauth = {
          role: response.data.role, // Preserve existing properties (e.g., role)
          accessToken: response.data.accessToken, // Update access token
        };
        localStorage.setItem('auth', JSON.stringify(newauth)); // Update localStorage
        return newauth;
      });


      return response.data.accessToken;
    } catch (err) {
      console.error('Refresh token failed:', err);
      throw err; // Propagate the error to the caller
    }
  };

  return refresh;
};

export default useRefreshToken; */

const useRefreshtoken = () => {
    const { setauth } = useAuth();

    const refresh = async () => {
        console.log('befre refresh');
        const response = await axios.get('/users/refresh', {
            withCredentials: true
        });
        console.log('after refresh');
        setauth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return {
                role: response.data.role,
                accessToken: response.data.accessToken,
                roomNo:response.data.roomNo ||null
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshtoken;