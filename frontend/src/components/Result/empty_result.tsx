import './result.css';

function Empty_result(){
    return (
      <div>
          <h1 className="main-text"
              style={{fontSize: '1.5rem'}}>
              Проверенные документы</h1>
          <div className="empty-result-container">
              <img src="../../../icons/nodocument.png"
                   className="files-image"></img>
          </div>
          <h1 className="minor-text"
            style={{fontSize: '1.3rem', paddingTop: '20px'}}>Вы ещё не загружали документы</h1>
      </div>
    );
}

export default Empty_result;