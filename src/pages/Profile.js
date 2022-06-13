import React, { useContext } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import pagecss from '../styles/Pages.module.css'
import photo from '../assets/taehyun.png'
import logo from '../assets/Frame.png'
import Navbar from '../components/Navbar'
import mouse from '../assets/mouse.png'
import { useMutation, useQuery } from 'react-query'
import { API } from '../config/api'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const { divMain, headingRed, textWhite, miniPict, btnRedFull } = pagecss

    const navigate = useNavigate()
    const [state, dispatch] = useContext(UserContext)
    let { data: profile, refetch: profileRefetch } = useQuery('usercache', async () => {
        const response = await API.get(`/profile/${state.user.id}`)
        console.log(state.user);
        return response.data.data
    })

    let { data: transactions, refetch: transactionRefetch } = useQuery('transactioncache', async () => {
        const response = await API.get('/transactions')
        return response.data.data
    })

    // const getUser = useMutation()
    return (
        <div className={divMain}>
            <div style={{ paddingTop: "20px" }}>
                <Navbar />
            </div>
            <Container className='mt-5'>
                <Row>
                    <Col>
                        <h4 className={headingRed}>My Profile</h4>
                        <Row>
                            <Col>
                                <div>
                                    <img src={profile?.image} style={{ width: "18rem", height: '23rem' }} />
                                    <button className={btnRedFull} style={{ width: "18rem", marginTop: '10px' }}
                                        onClick={() => navigate(`/editprofile/${state.user.id}`)}>
                                        Edit Profile
                                    </button>
                                </div>
                            </Col>
                            <Col>
                                <h6 className={headingRed}>Name</h6>
                                <p className={`mb-4 ${textWhite}`}>{state.user.name}</p>

                                <h6 className={headingRed}>Email</h6>
                                <p className={`mb-4 ${textWhite}`}>{state.user.email}</p>

                                <h6 className={headingRed}>Phone</h6>
                                <p className={`mb-4 ${textWhite}`}>{profile?.phone}</p>

                                <h6 className={headingRed}>Gender</h6>
                                <p className={`mb-4 ${textWhite}`}>{profile?.gender}</p>

                                <h6 className={headingRed}>Address</h6>
                                <p className={`mb-4 ${textWhite}`}>{profile?.address}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <h4 className={headingRed}>Product</h4>
                        {transactions?.length != 0 ? (
                            <>
                                {transactions?.map((item) => (
                                    <div style={{
                                        backgroundColor: "#303030",
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center"
                                    }}>
                                        <Row >
                                            <Col xs={4}>
                                                <img src={item.products.image} className={miniPict} />
                                            </Col>
                                            <Col xs={6}>
                                                <h5 className={headingRed}>{item.products.title}</h5>
                                                <p className={headingRed}>{item.createdAt}</p>
                                                <p className={textWhite}>Price: Rp.{item.price}</p>
                                                <h6 className={textWhite}>Sub Total : Rp.{item.price}</h6>
                                            </Col>
                                            <Col xs={2}>
                                                <div style={{
                                                    backgroundColor: "gray",
                                                    width: "7rem",
                                                    height:'7rem',
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "white"}}>
                                                    { item.status }
                                                </div>
                                        </Col>

                                    </Row>
                                    </div>
                        ))}
                    </>
                    ) : (
                    <>
                        <div className='py-5' style={{
                            backgroundColor: "#303030",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                        }}>
                            No Transactions
                        </div>
                    </>)}


                </Col>
            </Row>

        </Container>
        </div >
    )
}
