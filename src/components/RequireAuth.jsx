import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


//  FOLLOWING IMPLIES ----LOCALSTORAGE----

/*const RequireAuth = ({ allowedroles }) => {
  const { auth, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const userRoles = auth?.role ? (Array.isArray(auth.role) ? auth.role : [auth.role]) : [];
  

  if (auth?.accessToken && userRoles.some((role) => allowedroles?.includes(role))) {
    return <Outlet />;
  }

  if (auth?.accessToken) {
    return <Navigate to="/unauthorised" state={{ from: location }} replace />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth; */

const RequireAuth = ({ allowedroles }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const userRoles = auth?.role ? (Array.isArray(auth.role) ? auth.role : [auth.role]) : [];

  // Check if the user is a customer and has no room allocated
  const isCustomerWithoutRoom = userRoles.includes("customer") && !auth?.roomNo;
  console.log(auth);

  return (
    auth?.accessToken && userRoles.some((role) => allowedroles?.includes(role))
      ? (isCustomerWithoutRoom 
          ? <Navigate to="/waitingroom" state={{ from: location }} replace /> 
          : <Outlet />
        )
      : auth?.accessToken 
        ? <Navigate to="/unauthorised" state={{ from: location }} replace />
        : <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
