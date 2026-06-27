import styles from './result.module.css';

function Something_result(){
    return (
        <div>
        <h1 className={styles.mainText}
            style={{fontSize: '1.5rem'}}>
            Проверенные документы</h1>
        <table className={styles.somethingResultContainer}>
            <thead>
            <tr>
                <th>File-name</th>
                <th>Upload-time</th>
                <th>Status</th>
                <th>Download-link</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>file-name</td>
                <td>upload-time</td>
                <td>status</td>
                <td>download</td>
            </tr>
            <tr>
                <td>file-name</td>
                <td>upload-time</td>
                <td>status</td>
                <td>download</td>
            </tr>
            </tbody>
        </table>
        </div>
    );
}

export default Something_result;