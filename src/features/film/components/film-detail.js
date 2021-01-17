import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import Select from 'react-select'

FilmDetail.propTypes = {
    film: PropTypes.object
};

function FilmDetail(props) {
    const { film } = props
    let optionGenre = []
    let optionCountry = []

    if (film.genres) {
        console.log(film.genres)
        film.genres.map(item => {
            optionGenre.push({ value: item._id, label: item.name })
        })
    }
    if (film.countrys) {
        console.log(film.countrys)
        film.countrys.map(item => {
            optionCountry.push({ value: item._id, label: item.name })
        })
    }

    const [checkEdit, setCheckEdit] = useState(false)
    const handleChangeSetEdit = () => {
        setCheckEdit(!checkEdit)
    }

    return (
        <div className='detail'>
            <div className='infor'>
                <div className='control'>
                    <label>Name:</label>
                    <input type='text'
                        //disabled={!checkEdit}
                        className={checkEdit ? 'input edit' : 'input'} placeholder={film.name} value={film.name} />
                </div>

                <div className='control'>
                    <label>Genre:</label>
                    {/* <input type='text'
                        disabled={!checkEdit}
                        className={checkEdit ? 'input edit' : 'input'} placeholder={film.genres} value={film.genres} /> */}
                    <select className={checkEdit ? 'input edit' : 'input'} >
                        <option>
                            {
                                optionGenre.map(item => {
                                    return `${item.label}, `
                                })
                            }
                        </option>
                    </select>
                </div>

                <div className='control'>
                    <label>Country:</label>
                    {/* <input type='text'
                        disabled={!checkEdit}
                        className={checkEdit ? 'input edit' : 'input'} placeholder={film.genres} value={film.genres} /> */}
                    <select className={checkEdit ? 'input edit' : 'input'} >
                        <option>
                            {
                                optionCountry.map(item => {
                                    return `${item.label}, `
                                })
                            }
                        </option>
                    </select>
                </div>

                <div className='control'>
                    <label>Run time:</label>
                    <input type='text'
                        //disabled={!checkEdit}
                        className={checkEdit ? 'input edit' : 'input'} placeholder={film.runtime} value={`${film.runtime} phút`} />
                </div>

                <div className='control'>
                    <label>Price:</label>
                    <input type='text'
                        //disabled={!checkEdit}
                        className={checkEdit ? 'input edit' : 'input'} placeholder={film.price} value={`${film.price} VNĐ`} />
                </div>

                <div className='control'>
                    <label>Open day:</label>
                    <input type='text'
                        //disabled={!checkEdit}
                        className={checkEdit ? 'input edit' : 'input'} placeholder={film.openday} value={`${film.openday}`} />
                </div>

                <div className='control'>
                    <label>Trailer:</label>
                    <input type='text'
                        //disabled={!checkEdit}
                        className={checkEdit ? 'input edit' : 'input'} placeholder={film.trailer} value={film.trailer} />
                </div>

                <div className='control'>
                    <label>Description:</label>
                    <textarea className=' input' rows='4'>

                    </textarea>
                </div>

                <br />
                <div className={checkEdit ? 'button visible' : ' button hidden'}>
                    <button className='btn btn-secondary'>RESET</button>
                    <button className='btn btn-info'>SAVE</button>
                </div>
                <hr />
                <div>
                    Set 'Edit film':
                <Switch
                        // checked={state.checkedB}
                        onChange={handleChangeSetEdit}
                        color="primary"
                    // name="checkedB"
                    // inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                </div>

            </div>
            <div className='poster'>
                <img src={`http://localhost:5000/api/${film.poster}`} />
                <br />
                <br />
                <input type='file' style={{ width: '75%' }} />
            </div>
        </div>
    );
}

export default FilmDetail;