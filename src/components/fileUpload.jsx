const FileUpload = ({ redErrorText, handleFormSubmit, fileInputRef }) =>{
    return(<>
        <h4>file upload</h4>
        <p>{redErrorText ? "WRONG FILE UPLOADED" : null}</p>
        <form onSubmit = {handleFormSubmit}>
          <div>            
          <label htmlFor='files'>Select files</label>
           <input id="files" type="file"name="files" multiple ref={fileInputRef} />
          </div>
          <div>
            <button className="submit-btn" type='submit'>Upload</button>
          </div>
        </form>
        </>
    )
}
export default FileUpload