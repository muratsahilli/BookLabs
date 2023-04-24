import { useLocation,Navigate,Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({allowedRoles}) => {
    const{auth} = useAuth();
    const location = useLocation();
    return (
        auth && allowedRoles.includes(auth.roles)
            ?<Outlet/>
            :auth?.user
                ? <Navigate to="Unauthorized" state={{from:location}} replace/>
                : <Navigate to="Login" state={{from:location}} replace/>

    );

}
export default RequireAuth;