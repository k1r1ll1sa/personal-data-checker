import styles from './Main.module.css'
// @ts-ignore
import Empty_result from "../Result/empty_result.tsx";
import Something_result from "../Result/something_result.tsx";

function Main() {
    return (
        <main className="Main">
            {/* Загрузка файла */}
            <div className={styles.mainBackground}>
                <h1 className={styles.mainText}
                    style={{paddingTop: '80px', fontSize: '2rem',}}>
                    Проверьте свои документы на безопасность</h1>
                <div className={styles.fileChooserBackground}>
                    <div className={styles.fileChooser}>
                        <img src="../../../icons/pdf.png"
                             className={styles.filesImage}></img>
                        <img src="../../../icons/docx.png"
                             className={styles.filesImage}></img>
                    </div>
                    <div className={styles.fileChooser}>
                        <a style={{paddingTop: '20px'}}>
                            ЗАГРУЗИТЬ ФАЙЛ</a>
                    </div>
                    <a style={{color: 'white'}}>
                        .pdf или .docx до 20 Мб</a>
                </div>
                <h1 className={styles.minorText}
                    style={{paddingTop: '0', fontSize: '1.1rem',}}>
                    выберите или перетащите мышкой</h1>
                <hr/>

                {/* Результат проверки */}
                <Empty_result />
            </div>
        </main>
    );
}

export default Main;