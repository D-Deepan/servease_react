import { useContext, useState, useEffect } from 'react';
import Authcontext from '../context/Authprovider';



//  FOLLOWING IMPLIES ----LOCALSTORAGE----

/*const useAuth = () => {
  const { auth, setauth } = useContext(Authcontext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem('auth'));

    if (storedAuth) {
      setauth(storedAuth);
    }
    setIsLoading(false);
  }, [setauth]); // Include `setauth` in dependency

  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  return { auth, setauth, isLoading };
};

export default useAuth; */



const useAuth = () => {
    return useContext(Authcontext);
};

export default useAuth;

