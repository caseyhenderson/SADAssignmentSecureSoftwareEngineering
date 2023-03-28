import { useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
// custom react hook to auto logout after 2 minutes of inactivity
// inspired by https://dev.to/frontendtony/add-auto-logout-to-a-react-app-159i
// may need some slight changes for hook-i-ness
// still to be tested properly. 
// add logout function
// if it doesn't work as a hook just drop it into a page

export default function useLogout() {
    console.log("Automatic logout hook triggered.");
    const autoLogoutTimerRef = useRef(null);
    const dispatch = useDispatch();
    const logoutUser = () => {
        localStorage.removeItem('token');
        dispatch({type: "logout", payload: {} });
    }
    useEffect(() => {
    const autoLogout = () => {
        if (document.visibilityState === 'hidden') {
            console.log("Automatic logout countdown begins.");
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