import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios'
import callApi from 'api/apiCaller';

import Switch from '@material-ui/core/Switch';

// import PropTypes from 'prop-types';

// PageMain.propTypes = {

// };

function PageMain(props) {
    const [modal, setModal] = useState(false);
    const toggle = () => {
        setModal(!modal)
        setBanner([])
    };

    const onSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append("banner", bannerFilm);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        let filePath
        await axios.post('http://localhost:5000/api/banner/upload', formData, config).then(res => {
            //console.log('RES', res.data)
            filePath = res.data.split('/')[2]
        })

        await callApi('banner', 'POST', { name: nameValue, image: filePath }).then((res) => {
            let newBanners = [...banners]
            newBanners.push(res.data.banner)
            setBanners(newBanners)
        })
        toggle()
    }
    const [banner, setBanner] = useState([])
    const [bannerFilm, setBannerFile] = useState('')
    const changeInput = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {

            setBanner(reader.result)
            //setPoster(file)    		
        }
        reader.readAsDataURL(file)
        setBannerFile(file)
    }
    // load banner
    const [banners, setBanners] = useState([])
    const [bannerSelected, setBannerSelected] = useState([banners[0]])
    useEffect(() => {
        const LOADBANNER = async () => {
            let data = await callApi('banner')
            setBanners(data.data)
            setBannerSelected(data.data[0])

        }
        LOADBANNER()
    }, [])

    // handleChangeStatus
    const handleChangeStatus = (banner) => {
        const index = banners.indexOf(banner)
        let newBanners = [...banners]
        newBanners[index].status = !newBanners[index].status
        setBanners(newBanners)
        setBannerSelected(banner)
        callApi(`banner/update-status/${banner._id}`)
    }

    const [nameValue, setNameValue] = useState('')
    const changeName = (e) => {
        setNameValue(e.target.value)
    }

    //handleChangeBannerSelected
    const handleChangeBannerSelected = (banner) => {
        setBannerSelected(banner)
    }

    let count = 0
    return (
        <div className='page-main'>
            <div className='title'>
                <h2>Banner</h2>
                <FontAwesomeIcon className='ic ic-black' style={{ zIndex: 1 }} icon="plus" onClick={toggle} />
            </div>
            <hr className='op-5' />

            <div className='banner-content'>
                <div className='title'>
                    {
                        banners.map(item => {
                            if (item.status) {
                                count++
                            }
                        })
                    }
                    <b>Actived: {count}/{banners.length}</b>
                </div>
                <br />
                <div className='manage-banner'>
                    <div className='left'>
                        <div className='left-image'>
                            {
                                banners.map(banner => {
                                    return (
                                        <div key={banner._id} className={banner.status ? 'img-item actived' : 'img-item'}>
                                            <img src={`http://localhost:5000/api/banner/${banner.banner}`}
                                                onClick={() => handleChangeBannerSelected(banner)} />
                                            <div>
                                                <b>Actived:</b>
                                                <Switch
                                                    checked={banner.status}
                                                    onChange={() => handleChangeStatus(banner)}
                                                    color='primary'
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className='right'>
                        {
                            bannerSelected &&
                            <div className={bannerSelected.status ? 'banner-selected actived' : 'banner-selected'}>
                                <div className='banner-name'>{bannerSelected.name}</div>
                                <img src={`http://localhost:5000/api/banner/${bannerSelected.banner}`} />
                            </div>
                        }
                    </div>
                </div>
            </div>

            <Modal isOpen={modal} toggle={toggle} className='modal-style' size='lg'>
                <form onSubmit={onSubmit}>
                    <ModalHeader toggle={toggle}>Add new banner</ModalHeader>
                    <ModalBody>

                        <div className='control'>
                            <label>Select new banner</label>
                        </div>

                        <div className='col-12 row'>
                            <div className='col-2' style={{ textAlign: 'right' }}>
                                Name
                            </div>
                            <div className='col-9'>
                                <input type='text' name='name' className='form-control' onChange={changeName} value={nameValue} />
                            </div>
                        </div>

                        <br />
                        <div className='col-12 row'>
                            <div className='col-2' style={{ textAlign: 'right' }}>
                                Banner
                            </div>
                            <div className='col-9'>
                                <input type='file' name='banner' className='form-control' onChange={changeInput} />
                            </div>
                        </div>
                        <div>
                            {
                                banner.length > 0 && <div style={{ width: "100%", margin: "0 auto" }}><img src={banner ? banner : ''} style={{ width: '750px', height: '330px' }} alt='' /></div>
                            }
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-primary' color="primary" type='submit'>Upload</button>{' '}
                        <div className='btn btn-secondary' color="secondary" onClick={toggle}>Cancel</div>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
}

export default PageMain;