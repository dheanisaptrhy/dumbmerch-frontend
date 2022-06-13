import React, { useContext, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import signUpModule from '../../styles/Auth.module.css'
import { useMutation } from 'react-query'

import { API } from '../../config/api'

export default function Login() {
    const { main,
        miniContainer,
        signupH1,
        input,
        button,
    } = signUpModule
    // navigate
    const navigate = useNavigate()


    // state penyimpanan
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const { email, password } = form
    const [message, setMessage] = useState(null)

    // state usercontext
    const [state, dispatch] = useContext(UserContext)

    // change text
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // Submit
    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }
            const data = {
                email: email,
                password: password
            }

            const body = JSON.stringify(form)

            // insert data
            const response = await API.post('/login', body, config)

            console.log(response);
            if (response?.status === 200) {
                dispatch({
                    type: "LOGIN SUCCESS",
                    payload: response.data.data
                })
                
                if (response.data.data.status === "admin") {
                    navigate('/product')
                } else {
                    navigate('/home')
                }
                
                const alert = (
                    <Alert variant="success" className='py-1'>
                        Login Success
                    </Alert>
                )
                setMessage(alert)
            }
        } catch (error) {
            const alert = (
                <Alert variant="danger" className='py-1'>
                    Failed
                </Alert>
            )
            setMessage(alert)
            console.log(error);
        }

    })
    return (
        <div>
            <div className={main}>
                <div className={miniContainer}>
                    <div>
                        <h2 className={signupH1}>Login</h2>
                    </div>
                    <Form onSubmit={(e)=>handleSubmit.mutate(e)}>
                        <Form.Control
                            className={input}
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={email} />
                        <Form.Control
                            className={input}
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={password} />
                        <Button className={button} type="submit">
                            Login
                        </Button>
                    </Form>

                </div>
            </div>
        </div>
    )
}
