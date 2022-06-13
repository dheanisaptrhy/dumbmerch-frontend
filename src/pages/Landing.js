import React, { useState } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import Register from '../components/auth/Register'
import authcss from '../styles/Auth.module.css'
import logo from '../assets/Frame.png'
import Login from '../components/auth/Login'

export default function Landing() {
    const {
        main,
        btnLogin,
        btnRegis
    } = authcss

    const [isClick, setClick] = useState(false)

    const changeLogin = () => {
        setClick(false)
    }
    const changeRegister = () => {
        setClick(true)
    }
    return (
        <div className={main}>
            <div style={{
            }}>
                <img src={logo} />
                <h1 style={{
                    fontSize: "32",
                    color: "white",
                    fontWeight: "bold",
                    marginTop:"20px"
                }}>Easy, Fast and Reliable</h1>
                <p style={{
                    color:"#D2D2D240",
                    width:"70%",
                    marginBottom:"60px"
                }}>Go shopping for merchandise, just go to dumb merch shooping, the biggest merchandise in <b>Indonesia</b></p>
                <div style={{
                    display: "flex"
                }}>
                    <button className={btnLogin}
                        onClick={changeLogin}>Login</button>

                    <button className={btnRegis}
                        onClick={changeRegister}>Register</button>
                </div>
            </div>

            <div>
                {isClick ? <Register /> : <Login />}
            </div>

        </div>
    )
}
