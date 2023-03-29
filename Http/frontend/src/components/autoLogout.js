import { useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import log from 'loglevel';
import dayjs from 'dayjs';

// custom react hook to auto logout after 2 minutes of inactivity
// may need some slight changes for hook-i-ness
// still to be tested properly. 
// add logout function
// if it doesn't work as a hook just drop it into a page

export default function useLogout() {
    const autoLogoutTimerRef = useRef(null);
    const dispatch = useDispatch();
    const logoutUser = () => {
        localStorage.removeItem('token');
        dispatch({type: "logout", payload: {} });
        log.info("Logout at "+dayjs().format());

    }
    useEffect(() => {
    const autoLogout = () => {
        if (document.visibilityState === 'hidden') {
            log.info("Automatic logout countdown triggered at"+dayjs().format());
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