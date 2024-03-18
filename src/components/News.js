import React,{useEffect, useState}from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News =(props)=> {
 const[articles,setArticles]=useState([])
 const[loading,setLoading]=useState(true)
const [page, setPage] = useState(1)
const [totalResults, setTotalResult] = useState(0)
const [searchQuery, setSearchQuery] = useState('')


 const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const updateNews=async()=> {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json()
    props.setProgress(70);
    setArticles(parsedData.articles)
    setTotalResult(parsedData.totalResults)
    setLoading(false) 
    props.setProgress(100); 

  }
  useEffect(() => {
  document.title = `${capitalizeFirstLetter(props.category)}-NewsDaily`;
    updateNews();
    
  }, [])

//  const handlePreviousClick = async () => {
//      setPage(page-1)
//     updateNews();
//   }
//  const handleNextClick = async () => {
//   setPage(page+1)
//     updateNews();
//   }

 const handleSearch = async () => {
    //Perform the search using the current searchQuery
    const url = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(parsedData.articles)
    setTotalResult(parsedData.totalResults)
    setLoading(false) 
   
  };

  // Function to update search query in state
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

 const fetchMoreData = async() => {
    setPage(page + 1 )
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page+1}&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json()
    setArticles(articles.concat(parsedData.articles))
    setTotalResult(parsedData.totalResults)
     
  };

    return (
      <>
       <div className="container mt-3">
          <div className="input-group mb-3">
          <input type="text" className="form-control" placeholder="Search news..."style={{ marginTop:'50px'}} value={searchQuery} onChange={handleSearchInputChange}/>
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button"style={{ marginTop:'50px'}} onClick={handleSearch}>Search </button>
            </div>
          </div>
        </div>
        <h1 className='text-center' style={{ margin: '35px 0px',marginTop:'30px'}}>NewsDaily-Top {capitalizeFirstLetter(props.category)} Headlines</h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!==totalResults}
          loader={<Spinner/>}
        >
          <div className="container">
          <div className="row">
            {articles.map((element) => {
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description} imageUrl={element.urlToImage}
                  newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            })}
          </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePreviousClick}>&larr;Previous</button>
          <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div> */}
      </>
    )
      }
News.defaultProps = {
  country: 'in',
  pageSize: 12,
  category: 'general',
  searchQuery: ''
  }
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  searchQuery:PropTypes.string
}
export default News