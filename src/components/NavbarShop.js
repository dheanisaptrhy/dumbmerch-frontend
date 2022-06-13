import React, { useContext } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/Frame.png'
import { UserContext } from '../context/UserContext'
import pagecss from '../styles/Pages.module.css'

export default function NavbarShop() {
    const { btnNavbar } = pagecss
    const navigate = useNavigate();
    const [state, dispatch] = useContext(UserContext)

    const logout = () => {
        dispatch({
            type: "LOGOUT"
        })
        navigate('/')
    }
    return (
        <div style={{
            margin: "0 50px"
        }}>
            <Row>
                <Col xs={1}>
                    <img src={logo} style={{ width: "100px" }} />
                </Col>
                <Col xs={5}></Col>
                <Col xs={6} className='d-flex justify-content-end'>
                    <div className='d-flex justify-content-center align-items-center' >
                        <div>
                            <button className={btnNavbar}
                                onClick={() => navigate('/chatseller')}>Complain</button>

                            <button className={btnNavbar}
                                onClick={() => navigate('/category')}>Category</button>

                            <button className={btnNavbar}
                                onClick={() => navigate('/product')}>Product</button>

                            <button className={btnNavbar}
                                onClick={logout}>Logout</button>
                        </div>
                    </div>
                </Col>
            </Row>

        </div>
    )
}
