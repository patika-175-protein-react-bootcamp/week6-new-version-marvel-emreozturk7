import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const hash = "31d1793ffc28589ecedf05e6d0a38cc4";
const publicKey = "171e333a1dec2eeb5595ef5d54f5d3bc";


function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxElement, setMaxelement] = useState();
  const [offsetValue, setOffsetvalue] = useState(0);
  const [datas, setDatas] = useState([]);
  const [location, setLocation] = useState([]);


  useEffect(() => {
    fetch();
  }, [offsetValue]);

  const fetch = async () => {
    if (location.includes(currentPage)) {
      setItems(datas[location.indexOf(currentPage)]);
    }
    else {
      setLoading(true);

      const result = await axios(`http://gateway.marvel.com/v1/public/characters?offset=${offsetValue}?limit=20?ts=1&apikey=${publicKey}&hash=${hash}`);
      setItems(result.data.data.results);

      if (!datas.includes(result.data.data.results[0].id)) {
        sessionStorage.setItem('array', JSON.stringify(datas));
        setDatas([...datas, result.data.data.results]);
      }

      if (!location.includes(currentPage)) {
        setLocation([...location, currentPage]);
        sessionStorage.setItem('deneme', JSON.stringify(location));
      }
      setMaxelement(result.data.data.total / result.data.data.limit);

      setLoading(false);
    }
  }

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
    setOffsetvalue((pageNumber * 20) - 20);
  }

  const skipThreePage = (keep) => {
    if (keep === "before") {
      setCurrentPage(currentPage - 3);
    }
    else if (keep === "after") {
      setCurrentPage(currentPage + 3);
    }
    setOffsetvalue((currentPage * 20) - 20)
  }

  function nextPage() {
    if (currentPage !== 78) {
      setCurrentPage(currentPage + 1);
      setOffsetvalue(offsetValue + 20);
    }
  }

  function previousPage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      setOffsetvalue(offsetValue - 20);
    }
  }

  return (
    <div className="App">
      <div className="header">
        <img src='./images/heroes.png' className="heroes" alt='Heroes' />
        <img src='./images/marvel.png' className="marvel" alt='Marvel' />
      </div>
      <section className="hero-container">
        {
          items.map(item => (
            <CharacterCard key={item.id} item={item} loading={loading}></CharacterCard>
          ))
        }
      </section>
      {
        <div className="pagination-container">
          <button onClick={() => previousPage()}>
            <img className="left-icon" src="./icons/left.png" alt="Left Icon" />
          </button>

          {
            currentPage === 1 || currentPage === 2 || currentPage === 3
              ? <button className="unselected-page"></button>
              : <button className="unselected-page" onClick={() => changePage(1)}>1</button>
          }


          {
            currentPage === 1 || currentPage === 2 || currentPage === 3
              ? currentPage === 3
                ? <button className="unselected-page" onClick={() => changePage(1)}>1</button>
                : <button className="unselected-page"></button>
              : <button className="unselected-page" onClick={() => skipThreePage("before")}>...</button>
          }


          {
            currentPage === 1
              ? <button className="unselected-page"></button>
              : <button className="unselected-page" onClick={() => changePage(currentPage - 1)}>{currentPage - 1}</button>
          }

          <button className="selected-page">{currentPage}</button>

          {
            currentPage === maxElement
              ? <button className="unselected-page"></button>
              : <button className="unselected-page" onClick={() => changePage(currentPage + 1)}>{currentPage + 1}</button>
          }

          {
            currentPage === maxElement || currentPage === maxElement - 1 || currentPage === maxElement - 2
              ? currentPage === maxElement - 2
                ? <button className="unselected-page" onClick={() => changePage(maxElement)}>{maxElement}</button>
                : <button className="unselected-page"></button>
              : <button className="unselected-page" onClick={() => skipThreePage("after")}>...</button>
          }

          {
            currentPage === maxElement || currentPage === maxElement - 1 || currentPage === maxElement - 2
              ? <button className="unselected-page"></button>
              : <button className="unselected-page" onClick={() => changePage(maxElement)}>{maxElement}</button>
          }

          <button onClick={() => nextPage()}>
            <img className="right-icon" src="./icons/right.png" alt="Right Icon" />
          </button>
        </div>
      }
    </div>
  );
}

const CharacterCard = ({ item, loading }) => {
  return (
    <div className="container">
      <div className="hero-container">
        <div className="hero-card">
          {
            loading === false
              ?
              <figure>
                <img className="card-images" alt={item.name} src={item.thumbnail.path + "." + item.thumbnail.extension} />
                <figcaption>{item.name}</figcaption>
              </figure>
              :
              <figure>
                <img className="loading" alt="Loading" src="./images/loading.png" />
              </figure>
          }
        </div>
      </div>
    </div>
  )
}

export default App;
