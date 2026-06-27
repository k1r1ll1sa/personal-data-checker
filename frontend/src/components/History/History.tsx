import styles from './History.module.css'

function History() {
    return(
        <div className={styles.historyContainer}>
            <table>
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
                </tbody>
            </table>
        </div>
    );
}

export default History;