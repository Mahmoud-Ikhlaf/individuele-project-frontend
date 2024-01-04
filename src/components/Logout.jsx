import useLogout from '../hooks/useLogout';

const Logout = async () => {
    const logout = useLogout();
    await logout();
    window.location.replace("/inloggen");
}

export default Logout