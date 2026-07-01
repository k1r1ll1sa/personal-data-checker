import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import styles from './Main.module.css'
import Empty_result from "../Result/empty_result.tsx";
// @ts-ignore
import Something_result from "../Result/something_result.tsx";

function Main() {
    const [isDragging, setIsDragging] = useState(false);
    // @ts-ignore
    const [dragCounter, setDragCounter] = useState(0);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<'.docx' | '.pdf' | 'nontype'>('nontype');
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleZoneClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragCounter(prevState => prevState + 1);
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragCounter(prevState => {
            const newCount = prevState - 1;
            if (newCount === 0) {
                setIsDragging(false);
            }
            return newCount;
        });
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        setDragCounter(0);
        const file = event.dataTransfer.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const uploadFile = async (file: File) => {
        setUploadedFile(file);
        setUploadStatus('loading');
        setErrorMessage('');

        if (file.type === 'application/pdf'){
            setFileType('.pdf');
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            setFileType('.docx');
        } else {
            setFileType('nontype');
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const responce = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!responce.ok) {
                const errorData = await responce.json();
                throw new Error(errorData.detail || 'Ошибка загрузки файла');
            }

            const data = await responce.json();
            console.log('Файл загружен', data);

            setUploadStatus('loading');

            const analyzeResponse = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({filename: data.filename}),
            });

            if (!analyzeResponse.ok) {
                const errorData = await analyzeResponse.json();
                throw new Error(errorData.detail || 'Ошибка анализа файла');
            }

            const analysisData = await analyzeResponse.json();
            console.log(analysisData);

            setUploadStatus('success');

        } catch (error) {
            console.error(error);
            setUploadStatus('error');
            setErrorMessage(error instanceof Error ? error.message: 'Ошибка');
        }
    }

    return (
        <main className="Main">
            {/* Загрузка файла */}
            <div className={styles.mainBackground}>
                <h1 className={styles.mainText}
                    style={{paddingTop: '80px', fontSize: '2rem',}}>
                    Проверьте свои документы на безопасность</h1>
                <div className={`${styles.fileChooserBackground} ${isDragging ? styles.dragging : ''}`}
                    onClick={handleZoneClick}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf, .docx"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}/>

                    <div className={styles.fileChooser}>
                        { fileType === '.pdf' ? (
                            <img src="../../../icons/pdf.png"
                                className={styles.filesImage}></img>
                        ) : fileType === '.docx' ? (
                            <img src="../../../icons/docx.png"
                                 className={styles.filesImage}></img>
                        ) : uploadStatus === 'error' ? (
                            <img src="../../../icons/error.png"
                                className={styles.filesImage}></img>
                        ) : (
                            <>
                                <img src="../../../icons/pdf.png"
                                    className={styles.filesImage}></img>
                                <img src="../../../icons/docx.png"
                                    className={styles.filesImage}></img>
                            </>
                        )}
                    </div>

                    <div className={styles.fileChooser}>
                        {uploadStatus === 'loading' ? (
                            <a style={{paddingTop: '20px'}}>
                                Загрузка...</a>
                        ) : uploadedFile && uploadStatus === 'error' ? (
                            <a style={{paddingTop: '20px'}}>
                                Ошибка</a>
                        ) : uploadedFile && uploadStatus === 'success' ? (
                            <a style={{paddingTop: '20px'}}>
                                Анализ завершён</a>
                        ) : (
                            <a style={{paddingTop: '20px'}}>
                                ЗАГРУЗИТЬ ФАЙЛ</a>
                        )}
                    </div>
                    {uploadStatus === 'idle' && (
                        <a style={{ color: 'white' }}>
                            .pdf или .docx до 20 Мб
                        </a>
                    )}
                </div>
                {uploadStatus === 'error' && (
                    <div style={{ color: 'red',
                                  marginTop: '20px',
                                  textAlign: 'center' }}>
                        {errorMessage}
                    </div>
                )}
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