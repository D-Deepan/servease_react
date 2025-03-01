import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshtoken from '../hooks/useRefreshtoken';
import useAuth from '../hooks/useAuth';


//  FOLLOWING IMPLIES ----LOCALSTORAGE----

/*const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshtoken();
  const { setauth, auth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        const newaccesstoken = await refresh(); // Refresh the access token
        setauth((prev) => ({
          ...prev,
          accessToken: newaccesstoken,
        }));
      } catch (err) {
        console.error('Refresh token verification failed:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (!auth?.accessToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    console.log('Auth after token refresh:', auth);
  }, [auth]); // Log auth only when it updates

  return isLoading ? <p>Loading...</p> : <Outlet />;
};

export default PersistLogin;*/

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshtoken();
    const { auth } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error('in persist');
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }
        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`)
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    }, [isLoading])

    return (
        <>
            {      isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin
