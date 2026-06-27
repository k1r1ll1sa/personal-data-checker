import styles from './result.module.css';

function Empty_result(){
    return (
      <div>
          <h1 className={styles.mainText}
              style={{fontSize: '1.5rem'}}>
              Проверенные документы</h1>
          <div className={styles.emptyResultContainer}>
              <img src="../../../icons/nodocument.png"
                   className={styles.filesImage}></img>
          </div>
          <h1 className={styles.minorText}
            style={{fontSize: '1.3rem', paddingTop: '20px'}}>Вы ещё ничего не загружали</h1>
      </div>
    );
}

export default Empty_result;