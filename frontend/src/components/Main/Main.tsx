import './Main.css'
import Empty_result from "../Result/empty_result.tsx";
import Something_result from "../Result/something_result.tsx";

function Main() {
    return (
        <main className="Main">
            {/* Загрузка файла */}
            <div className="main-background">
                <h1 className="main-text"
                    style={{paddingTop: '80px', fontSize: '2rem',}}>
                    Проверьте свои документы на безопасность</h1>
                <div className="file-chooser-background">
                    <div className="file-chooser">
                        <img src="../../../icons/pdf.png"
                             className="files-image"></img>
                        <img src="../../../icons/docx.png"
                             className="files-image"></img>
                    </div>
                    <div className="file-chooser">
                        <a style={{paddingTop: '20px'}}>
                            ЗАГРУЗИТЬ ФАЙЛ</a>
                    </div>
                    <a style={{color: 'white'}}>
                        .pdf или .docx до 20 Мб</a>
                </div>
                <h1 className="minor-text"
                    style={{paddingTop: '0', fontSize: '1.1rem',}}>
                    выберите или перетащите мышкой</h1>
                <hr/>

                {/* Результат проверки */}
                <Something_result/>
            </div>
        </main>
    );
}

export default Main;