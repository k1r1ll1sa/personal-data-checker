import './result.css';

function Something_result(){
    return (
        <div>
        <h1 className="main-text"
            style={{fontSize: '1.5rem'}}>
            Проверенные документы</h1>
        <table className="something-result-container">
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