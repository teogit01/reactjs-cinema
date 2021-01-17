import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Banner from 'components/client/commons/banner'
import Film from 'components/client/components/film'
import Filter from 'components/client/commons/filter'
import callApi from 'api/apiCaller';

import Carousel from 'react-elastic-carousel'

import PropTypes from 'prop-types';
import { useRouteMatch, useHistory } from 'react-router-dom';

Home.propTypes = {
    brach: PropTypes.object
}

function SET_FIlm_RENDER(films) {
    let page = Math.ceil(films.length / 8)
    let filmPerPage = []
    let filmRender = []
    for (let i = 1; i <= page; i++) {
        filmPerPage = films.slice(i * 8 - 8, i * 8)
        filmRender.push(filmPerPage)
    }
    return filmRender
}

function Home(props) {
    const { branch } = props
    const [films, setFilms] = useState([])
    useEffect(() => {
        const LOADFILM = async () => {
            let data = await callApi('film/client')
            setFilms(data.data)
        }
        LOADFILM()
    }, [])

    /// handle    
    let filmRender = []
    if (films.length > 0) {
        filmRender = SET_FIlm_RENDER(films)
    }

    const [carousel, setCarousel] = useState('')
    const next = () => {
        carousel.slideNext()
    }
    const prev = () => {
        carousel.slidePrev()
    }

    // control film showing, film comming soon
    const [typeShow, setTypeShow] = useState(1)
    const handleChangeTypeShow = (type) => {
        type == 1 ? setTypeShow(0) : setTypeShow(1)
    }
    const match = useRouteMatch()
    const history = useHistory()
    const handleDetail = (film) => {
        history.push(`${match.url}/film/${film._id}`)
    }
    return (

        < div className='page-home' >
            <Banner />
            <Filter branch={branch} />

            <div className="list-film">
                <div className='control-film'>
                    <h4 className={typeShow === 1 ? 'actived' : ''} onClick={() => handleChangeTypeShow(0)}>Đang chiếu</h4>
                    <h4 className={typeShow === 0 ? 'actived' : ''} onClick={() => handleChangeTypeShow(1)}> Sắp chiếu</h4>
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
                                filmRender.map((page, idx) => {
                                    return (
                                        <div className='carousel' key={idx}>
                                            <div className='carousel-item'>
                                                {
                                                    page.map(film => {
                                                        if (film.status === typeShow)
                                                            return (
                                                                <div key={film._id} onClick={() => handleDetail(film)}>
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

            {/* <Branch /> */}
        </div >
    );
}

export default Home;