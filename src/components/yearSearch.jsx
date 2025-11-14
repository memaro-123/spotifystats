const YearSearch = ({year,onYearChange,onYearClick }) =>{
    return(<>
        <div>year: <input value={year}onChange={onYearChange}/></div>
        <button type="submit" onClick={onYearClick }>change year </button>
        <p>type "all" for lifetime data</p>
        </>
    )
}
export default YearSearch