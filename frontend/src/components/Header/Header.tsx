import './Header.css'

function Header() {
    return(
        <header className = "header">
            <div className = "header-background">
                <div className = "logo">
                    <img src = "../../../icons/logo.png" alt="logo" className="logo-icon"/>
                    Personal Data Checker
                </div>
                <h1 className = "header-text" style = {{ fontSize: '1.5rem'}}>История</h1>
            </div>
        </header>
    );
}

export default Header;