import React, { useState, useEffect } from 'react';
import './css/banner.scss'
import callApi from 'api/apiCaller';
import { Carousel } from 'react-bootstrap'

function Banner() {
    const [banners, setBanners] = useState([])
    useEffect(() => {
        const LOADBANNER = async () => {
            let data = await callApi('banner/active')
            setBanners(data.data)
        }
        LOADBANNER()
    }, [])
    return (
        <div className="banner">
            {
                banners.length > 0 &&
                <Carousel interval={4000}>
                    {
                        banners.map(banner => {
                            return (
                                <Carousel.Item key={banner._id}>
                                    <img
                                        className=""
                                        src={`http://localhost:5000/api/banner/${banner.banner}`}
                                        alt="First slide"
                                    />
                                    <Carousel.Caption>

                                    </Carousel.Caption>
                                </Carousel.Item>
                            )
                        })
                    }
                </Carousel>
            }
        </div >
    )
}

export default Banner;