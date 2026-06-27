import History from "../History/History.tsx";

import styles from './Header.module.css'

import {useState, useEffect, useRef} from "react";

function Header() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const historyRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (buttonRef.current && buttonRef.current.contains(event.target as Node)){
                return;
            }

            if (historyRef.current && !historyRef.current.contains(event.target as Node )) {
                setIsHistoryOpen(false);
            }
        }

        if (isHistoryOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isHistoryOpen]);

    const toggleHistory = () => {
        setIsHistoryOpen(!isHistoryOpen);
    }

    return(
        <header>
            <div className = {styles.headerBackground}>
                <div className = {styles.logo}>
                    <img src = "../../../icons/logo.png" alt="logo" className={styles.logoIcon} />
                    Personal Data Checker
                </div>
                <h1 className ={styles.headerText}
                    style = {{ fontSize: '1.5rem', cursor: 'pointer' }}
                    ref={buttonRef}
                    onClick={toggleHistory}>
                    История</h1>
            </div>
            {isHistoryOpen && (
                <div ref={historyRef}>
                    <History />
                </div>
            )}
        </header>
    );
}

export default Header;