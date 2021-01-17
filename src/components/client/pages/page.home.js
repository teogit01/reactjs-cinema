import React, { useEffect, useState } from 'react';
// import './components/css/page-home.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Banner from 'components/client/commons/banner'
import Film from 'components/client/components/film'
import Filter from 'components/client/commons/filter'
import callApi from 'api/apiCaller';

import Carousel from 'react-elastic-carousel'

import PropTypes from 'prop-types';
import { useRouteMatch, useHistory } from 'react-router-dom';

PageHome.propTypes = {
    branchActived: PropTypes.object
}

// function SET_FIlm_RENDER(films) {
//     let page = Math.ceil(films.length / 8)
//     let filmPerPage = []
//     let filmRender = []
//     for (let i = 1; i <= page; i++) {
//         filmPerPage = films.slice(i * 8 - 8, i * 8)
//         filmRender.push(filmPerPage)
//     }
//     return filmRender
// }

function PageHome(props) {
    const { branchActived } = props
    const [films, setFilms] = useState([])
    const [filmAll, setFilmAll] = useState([])
    const [filmRender, setFilmRender] = useState([])
    const [pageMax, setPageMax] = useState(0)
    const [typeShow, setTypeShow] = useState(1)

    useEffect(() => {
        if (branchActived && branchActived.theaters && branchActived.theaters.length > 0) {
            let arrFilm = []
            branchActived.theaters.map(theater => {
                let data = arrFilm.concat(theater.films)
                arrFilm = data
            })
            //const newFilms = arrFilm.filter((item, idx) => arrFilm.findIndex(e => e._id === item._id) === idx && item.status && item.type === typeShow)
            //setFilms(newFilms)
            const newFilms = arrFilm.filter((item, idx) => arrFilm.findIndex(e => e._id === item._id) === idx)
            const newFilmType = arrFilm.filter((item, idx) => arrFilm.findIndex(e => e._id === item._id) === idx && item.status && item.type === typeShow)
            setFilmAll(newFilms)
            setFilms(newFilmType)
        }
    }, [branchActived])

    const [carousel, setCarousel] = useState('')
    const next = () => {
        carousel.slideNext()
        // setPage(page + 1 > pageMax.length ? page : page + 1)
    }
    const prev = () => {
        carousel.slidePrev()
        // setPage(page - 1 === 0 ? page : page - 1)
    }
    //const [page, setPage] = useState(1)
    useEffect(() => {
        if (films.length > 0) {
            // setPageMax(Math.ceil(films.length / 8))
            setFilmRender([...films.slice(0, 8)])
            const arr = []
            const data = []
            for (let i = 0.; i < Math.ceil(films.length / 8); i++) {
                arr.push(i)
                data.push([...films.slice((i + 1 - 1) * 8, (i + 1 - 1) * 8 + 8)])
            }
            setFilmRender(data)
            setPageMax(arr)
        }
    }, [films])
    useEffect(() => {
        if (filmAll.length > 0) {
            const newFilms = filmAll.filter((item, idx) => filmAll.findIndex(e => e._id === item._id) === idx && item.status && item.type === typeShow)
            setFilms(newFilms)
        }
    }, [typeShow])
    //console.log(filmRender)

    // useEffect(() => {
    //     //setFilmRender([filmRender, ...films.slice((page - 1) * 8, (page - 1) * 8 + 8)])
    //     setFilmRender([...films.slice((page - 1) * 8, (page - 1) * 8 + 8)])
    // }, [page])
    // control film showing, film comming soon

    const handleChangeTypeShow = (type) => {
        type == 1 ? setTypeShow(2) : setTypeShow(1)
    }
    const match = useRouteMatch()
    const history = useHistory()
    const _detail = (type, value) => {
        if (type === 'film')
            history.push(`${match.url}/film/${value._id}`)
    }
    // console.log({ filmRender })
    // console.log({ page })
    // console.log({ pageMax })
    // console.log({ films })

    return (

        <div className='page-home' >
            <Banner />
            <Filter branchActived={branchActived} />

            <div className="list-film">
                <div className='control-film'>
                    <h4 className={typeShow === 1 ? 'actived' : ''} onClick={() => handleChangeTypeShow(2)}>Đang chiếu</h4>
                    <h4 className={typeShow === 2 ? 'actived' : ''} onClick={() => handleChangeTypeShow(1)}> Sắp chiếu</h4>
                </div>
                <br />
                <div className='main-film'>
                    <div className='back'>
                        <FontAwesomeIcon className='' icon="chevron-left" onClick={prev} />
                    </div>
                    <div className='show-film'>
                        <Carousel itemsToShow={2}
                            renderPagination={() => { return (<></>) }}
                            renderArrow={() => { return (<></>) }}
                            itemsToShow={1}
                            autoTabIndexVisibleItems={true}
                            ref={ref => (setCarousel(ref))}
                            transitionMs={700}
                        >
                            {
                                pageMax.length > 0 &&
                                pageMax.map((page, idx) => {
                                    if (idx === page)
                                        return (
                                            <div className='carousel' key={idx}>
                                                <div className='carousel-item'>
                                                    {
                                                        (filmRender[idx].length > 0) &&
                                                        filmRender[idx].map(film => {
                                                            if (film.type === typeShow)
                                                                return (
                                                                    <div key={film._id} onClick={() => _detail('film', film)}>
                                                                        <Film film={film} />
                                                                    </div>
                                                                )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                })
                            }
                        </Carousel>
                    </div>
                    <div className='next'>
                        <FontAwesomeIcon className='' icon="chevron-right" onClick={next} />
                    </div>
                </div>
            </div>

        </div >
    );
}

export default PageHome;