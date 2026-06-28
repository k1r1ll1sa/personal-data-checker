import Main from './components/Main/Main'
import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer";

import { Helmet } from "react-helmet";
import './App.css'

function App() {
    return (
        <>
            <Helmet>
                <title>Personal Data Checker</title>
                <link rel="icon" href="../icons/logo.png"></link>
            </Helmet>
            <div className="App">
                <Header/>
                <Main/>
                <Footer/>
            </div>
        </>
    )
}

export default App
