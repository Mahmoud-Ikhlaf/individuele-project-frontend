import axiosPrivate from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            await axiosPrivate.get('/auth/logout', {
                withCredentials: true
                }
            );
        } catch (err) {
            console.error(err);
        }
    }
    return logout;
}

export default useLogout