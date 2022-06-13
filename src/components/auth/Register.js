import React, { useContext, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import signUpModule from '../../styles/Auth.module.css'
import { useMutation } from 'react-query'

// config API 
import { API } from '../../config/api'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'

export default function Register() {
    let navigate = useNavigate()
    const { main,
        miniContainer,
        signupH1,
        input,
        button,
    } = signUpModule

    // state
    const [state, dispatch] = useContext(UserContext)
    const [message, setMessage] = useState(null)
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    })
    const { name, email, password } = form

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

            // awalnya form, diubah ke dalam json
            const body = JSON.stringify(form)

            // insert data
            const response = await API.post('/register', body, config)

            if (response.data.status === 'success') {
                const alert = (
                    <Alert variant="success" className='py-1'>
                        Success
                    </Alert>
                )
                setMessage(alert)
                setForm({
                    name: '',
                    email: '',
                    password: ''
                })
            } else {
                const alert = (
                    <Alert variant="danger" className='py-1'>
                        Failed
                    </Alert>
                )
                setMessage(alert)
            }
        } catch (error) {
            const alert = (
                <Alert variant="danger" className='py-1'>
                    Failed bruh
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
                        <h2 className={signupH1}>Register</h2>
                    </div>
                    {message && message}
                    <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                        <Form.Control
                            className={input}
                            type="text"
                            placeholder="Name"
                            name="name"
                            onChange={handleChange}
                            value={name} />
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
                            Register
                        </Button>
                    </Form>

                </div>
            </div>
        </div>
    )
}
