import React, { useState } from 'react';
//import PropTypes from 'prop-types';
import axios from 'axios'

const Upload = props => {
    const [poster, setPoster] = useState('')
    const [img, setImg] = useState('')
    const onSubmit = (e) => {
        e.preventDefault()
        console.log('submit')
        const formData = new FormData();
        formData.append("poster", poster);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        console.log('up')
        axios.post('http://localhost:5000/api/film/poster', formData, config).then(res => {
            console.log('RES', res.data.fileNameInServer)
            console.log(res.data)
            let filePath = res.data.fileNameInServer
            if (filePath) {
                // NOTE: Vì tôi viết trên windows nên split theo dấu "\", nếu bạn chạy app trên Mac or linux mà gặp lỗi chỗ này thì xem xét đổi thành "/". nếu đổi sang "/" thì chỉ dùng 1 dấu "/" chứ ko phải hai dấu như "\\".
                filePath = filePath.split('/')[2]
                console.log('file', filePath)
                // setImg('http://localhost:5000/show/' + filePath)
                //console.log('img', img)
            }

        })
    }

    const onChange = (e) => {
        console.log(e.target.files[0])
        setPoster(e.target.files[0])

    }
    return (
        <div>
            <form
                encType="multipart/form-data"
                onSubmit={onSubmit}
            >
                <input type='file' name='poster' className='form-control' onChange={onChange} />
                <br />
                <button className='btn btn-info' type='submit'>Upload</button>
            </form>
            <img
                src={img}
                width='300'
            />

        </div>
    );
};

Upload.propTypes = {

};

export default Upload;  