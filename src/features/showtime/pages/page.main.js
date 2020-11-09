import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';

import PropTypes from 'prop-types';
import classNames from 'classnames'

import Theater from './../compoments/theater'
import Detail from './../compoments/detail'
import Branch from './../compoments/branch'

import { getDate, format, addDays, getDay, setDate } from 'date-fns'
import callApi from 'api/apiCaller'
import useQuery from 'components/queries'

PageMain.propTypes = {
    branchs: PropTypes.array,
    theaters: PropTypes.array,
    films: PropTypes.array,
    filmAdd: PropTypes.array,
    DATES: PropTypes.array
};

const TH = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saruday'
]
function createDate() {
    const dateCurrent = new Date()
    const DATES = []
    //console.log(format(dateCurrent, 'dd-MM-yyy'))
    for (let i = -7; i <= 7; i++) {
        let date = addDays(dateCurrent, i)
        DATES.push({
            //date: format(date, 'yyyy-MM-dd'),
            date: date,
            day: getDate(date),
            th: TH[getDay(date)],
            isPass: i >= 0 ? false : true,
            isActived: i === 0 ? true : false
        })
    }
    return DATES
}
function PageMain(props) {
    // contructor
    const { branchs, theaters, films, filmAdd } = props
    let query = useQuery()
    let DATES = createDate()
    const [dateCurrent, setDateCurent] = useState(new Date())
    const [dates, setDates] = useState(DATES)
    let branch = null
    let theater = null
    const [filmOfTheater, setFilmOftheater] = useState(films)

    //const [showtimes, setShowtimes] = useState([])
    useEffect(() => {
        const LoadShowtime = async () => {
            let data = await callApi(`showtime`)
            //setFilms(data.data.films)            
            //setShowtimes(data.data)
        }
        LoadShowtime()
    }, [dateCurrent])
    // end contructor
    // add film
    // modal ----------    
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const save = (e) => {
        e.preventDefault()
        let data = {
            _idtheater: query.get('_idtheater'),
            _idfilm: _idfilm
        }
        //console.log(data)
        callApi('film/add/theater', 'POST', { data }).then((res) => {
            //console.log('data', res.data)
            let newFilms = [...filmOfTheater, res.data.film]
            // //console.log('new theaters', res.data.theaters)
            setFilmOftheater(newFilms)
            // //setTheaters(res.data.theaters)
            // dispatch(loadTheater(res.data.theaters))
        })

        setModal(!modal);
    }
    // end modal ----------

    // handle ------------
    const addFilm = () => {
        setModal(!modal);
    }
    const [_idfilm, setIdFilm] = useState('')
    // change selett film
    const getIdFilm = (e) => {
        setIdFilm(e.target.value)
    }
    const handleRemoveFilm = (film) => {
        let newFilms = filmOfTheater.filter(item => item._id !== film._id)
        setFilmOftheater(newFilms)
    }

    // date
    //console.log(dateCurrent)
    const selectDate = (idx) => {
        let newDate = [...dates]
        newDate.map(item => {
            item.isActived = false
        })
        newDate[idx].isActived = !newDate[idx].isActived
        setDates(newDate)
        setDateCurent(newDate[idx].date)
    }

    //console.log('date', format(dateCurrent, 'dd/MM/yyyy'))
    // end handle ------------------
    return (
        <div className='page-main'>
            <div className='title '>
                <h2>Show Time</h2>
                <FontAwesomeIcon className='ic ic-black' icon="plus" onClick={addFilm} />
            </div>
            <hr className='op-5' />
            <div className='page-main__content'>
                <div className='filter'>
                    <div className='branchs'>
                        {
                            branchs && branchs.map(item => {
                                if (item._id === query.get('_idbranch'))
                                    branch = item
                                return <Branch key={item._id} branch={item} />
                            })
                        }
                    </div>

                    <div className='theaters'>
                        {
                            theaters && theaters.map(item => {
                                if (item._id === query.get('_idtheater'))
                                    theater = item
                                return <Theater key={item._id} theater={item} />
                            })
                        }
                    </div>
                    {/* detail show time */}
                    <div className='infor-showtime'>
                        <div className='schedule'
                        //onScroll={handleScroll}
                        >
                            <div className='schedule__head'>

                                {
                                    dates && dates.map((item, idx) => {
                                        return (
                                            <div
                                                key={item.date}
                                                className={
                                                    classNames(
                                                        'schedule__head__item',
                                                        //item.isPass && checkDayPass ? 'none' : '',
                                                        item.isPass ? 'opacity-5' : '',
                                                        item.isActived ? 'actived' : '',
                                                    )}
                                                onClick={() => selectDate(idx)}
                                            >
                                                <div className='bold'>{item.th}</div>
                                                <div>{format(item.date, 'dd/MM/yyyy')}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div className='showtime'>
                            {
                                films ? films.map((item, idx) => {
                                    return (
                                        <div key={idx}>
                                            < Detail
                                                film={item}
                                                theater={theater}
                                                branch={branch}
                                                dateCurrent={dateCurrent}

                                                //showtimes={showtimes}
                                                remove={handleRemoveFilm} />
                                        </div>
                                    )
                                }) : <FontAwesomeIcon
                                        className='ic-init fs-16' icon={['fas', 'plus']}
                                    //onClick={add}
                                    //onClick={toggle}
                                    />
                            }
                            {/* <Detail /> */}
                        </div>
                    </div>
                </div>
            </div >

            <div>
                <Modal isOpen={modal} toggle={toggle} className='modal-style'>
                    <Form onSubmit={save}>
                        <ModalHeader toggle={toggle}>Select film</ModalHeader>
                        <ModalBody>

                            <div className='control'>
                                <label>Select new film</label>
                                <select className='_idfilm' name='_idfilm' onChange={getIdFilm}>
                                    <option>Select film</option>
                                    {
                                        filmAdd && filmAdd.map(film => {
                                            return <option key={film._id} value={film._id}>{film.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div>

                            </div>

                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type='submit'>Select</Button>{' '}
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        </div >
    );
}

export default PageMain;