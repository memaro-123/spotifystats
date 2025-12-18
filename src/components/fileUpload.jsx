import React, { useState } from 'react';

const FileUpload = ({ redErrorText, handleFormSubmit, fileInputRef }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-box">
        <h3 className="upload-title">
          <i className="fas fa-cloud-upload-alt"></i> Upload Your Spotify Data
        </h3>
        
        <p className="upload-subtitle">
          Export your Spotify data and upload the .zip file to see your personalized stats
        </p>
        
        <form onSubmit={handleFormSubmit} className="upload-form">
          <div className="file-input-wrapper">
            {/* Custom File Input Styling */}
            <div className="file-input-group">
              <input
                type="file"
                ref={fileInputRef}
                accept=".zip"
                id="file-upload"
                className="file-input"
                onChange={handleFileChange}
              />
              <div className="file-input-display">
                <button 
                  type="button"
                  className="file-browse-button"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <i className="fas fa-folder-open"></i>
                  Browse Files
                </button>
                <div className="file-name-display">
                  {fileName ? (
                    <>
                      <i className="fas fa-check-circle" style={{ color: '#1DB954', marginRight: '8px' }}></i>
                      <span className="file-name">{fileName}</span>
                      <button 
                        type="button"
                        className="file-clear-button"
                        onClick={() => {
                          fileInputRef.current.value = '';
                          setFileName('');
                        }}
                        title="Clear file"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <span className="file-placeholder">No file selected</span>
                  )}
                </div>
              </div>
            </div>
            <span className="file-hint">Accepted: .zip files only</span>
          </div>
          
          <button type="submit" className="upload-button" disabled={!fileName}>
            <i className="fas fa-chart-bar"></i>
            {fileName ? 'Upload & Generate Stats' : 'Select a file first'}
          </button>
        </form>
        
        {redErrorText && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            Error: Please select a valid .zip file
          </div>
        )}
        
        <div className="upload-help">
          <h4><i className="fas fa-question-circle"></i> How to get your data:</h4>
          <ol>
            <li>Go to Spotify's Privacy Settings</li>
            <li>Request your extended streaming history</li>
            <li>Wait for email (may take a few days)</li>
            <li>Download the .zip file when received</li>
            <li>Upload it here</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;