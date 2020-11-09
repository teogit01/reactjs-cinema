import PropTypes from 'prop-types'
import React, { useState } from 'react';

//import { Label, Input } from 'reactstrap'

CustomPoster.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    receiveData: PropTypes.func,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool

}
CustomPoster.defaultProps = {
    //receiveData: null,
    label: '',
    placeholder: '',
    disabled: false
}
function CustomPoster(props) {

    const { field, placeholder, receiveData } = props
    const { name, value } = field
    const [poster, setPoster] = useState([])
    //const [img, setImg] = useState({})
    const handleChange = (e) => {

        let reader = new FileReader();
        let file = e.target.files[0];
        //setImg(file)
        reader.onloadend = () => {

            setPoster(reader.result)
            //setPoster(file)    		
        }
        reader.readAsDataURL(file)
        receiveData(file)
        //console.log('img', img)
        // const changeEvent = {
        //     target: {
        //         name: name,
        //         value: poster
        //     }
        // }
        // field.onChange(changeEvent)

    }

    //console.log('value', img)

    return (
        <div className='show_poster'>
            <div className='show_poster__img'>
                <img src={poster ? poster : ''} style={{ width: '250px', height: '350px' }} alt='Poster' />
            </div>
            <div className='show_poster__press'>
                <input
                    id={name}
                    type='file'
                    className=''
                    {...field}
                    value={value}

                    onChange={handleChange}
                    placeholder={placeholder}
                />

            </div>
        </div>
    );
}

export default CustomPoster;
