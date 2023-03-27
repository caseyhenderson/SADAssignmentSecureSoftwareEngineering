// custom react hook to auto logout after 2 minutes of inactivity
// inspired by https://dev.to/frontendtony/add-auto-logout-to-a-react-app-159i
// may need some slight changes for hook-i-ness
// still to be tested properly. 
export default function autoLogout() {
    const autoLogoutTimerRef = useRef(null);

    useEffect(() => {
    const autoLogout = () => {
        if (document.visibilityState === 'hidden') {
        const timeoutVal = window.setTimeout(logoutUser, 2 * 60 * 1000);
        autoLogoutTimerRef.current = timeoutVal;
        } else {
        window.clearTimeout(autoLogoutTimerRef.current);
        }
    };

    document.addEventListener('visibilitychange', autoLogout);

    return () => {
        document.removeEventListener('visibilitychange', autoLogout);
    };
    }, []);
}