import React, { useState } from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'
import Navbar from '../components/Navbar'
import pagecss from '../styles/Pages.module.css'
import product from '../data/product'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { API } from '../config/api'

export default function UserShop() {
    const { divMain, headingRed, card, input, btnInput } = pagecss
    const navigate = useNavigate()
    const [search, setSearch] = useState(null)

    // fetch data
    let { data: products } = useQuery('productsCache', async () => {
        const response = await API.get('/products')
        return response.data.data
    })

    return (
        <div className={divMain}>
            <div style={{ paddingTop: "20px" }}>
                <Navbar />
            </div>
            <Container className='mt-5'>
                <h4 className={headingRed}>Product</h4>
                <input placeholder='Search Product' className={input}
                    onChange={(e) => setSearch(e.target.value)} />
                {/* {search ? ( */}
                <div className='d-flex flex-wrap'>
                    {products?.filter(item => {
                        if (search === null) {
                            return item
                        } else if (item.title.toLowerCase().includes(search.toLowerCase())) {
                            return item
                        }
                    }).map((item, index) => (
                        <Card className={card} onClick={() => navigate(`/detailpage/${item.id}`)} key={index.id}>
                            <Card.Img variant="top" src={item.image}
                                style={{ width: '200px', height: '200px' }} />
                            <Card.Body>
                                <Card.Title className={headingRed}>{item.title}</Card.Title>
                                <Card.Text>
                                    <p> Rp. {item.price}</p>
                                    <p> Stock : {item.qty}</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
                {/* // ) : ()} */}
                {/* <div className='d-flex flex-wrap'>
                    {products?.map((data, index) => (
                        <Card className={card} onClick={() => navigate(`/detailpage/${data.id}`)} key={index.id}>
                            <Card.Img variant="top" src={data.image}
                                style={{ width: '200px', height: '200px' }} />
                            <Card.Body>
                                <Card.Title className={headingRed}>{data.title}</Card.Title>
                                <Card.Text>
                                    <p> Rp. {data.price}</p>
                                    <p> Stock : {data.qty}</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div> */}

            </Container>
        </div>
    )
}
