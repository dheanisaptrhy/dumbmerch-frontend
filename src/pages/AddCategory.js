import React, { useState } from 'react'
import { Button, Card, Container, Table, Modal, Form } from 'react-bootstrap'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import NavbarShop from '../components/NavbarShop'
import { API } from '../config/api'
import pagecss from '../styles/Pages.module.css'
import productcss from '../styles/Product.module.css'

export default function AddCategory() {
    const { divMain,
        headingWhite, } = pagecss
    const { input, btnSave } = productcss
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: ""
    })
    const { category } = form

    // handle change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // handle submit
    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }
            const body = JSON.stringify(form)
            const response = await API.post('/category', body, config)
            navigate('/category')
        } catch (error) {
            console.log(error);
        }
    })
    return (
        <div className={divMain}>
            <div style={{ paddingTop: "20px" }}>
                <NavbarShop />
            </div>
            <Container className='mt-5'>
                <h4 className={headingWhite}>Add Category</h4>
                <Form className='mt-5' onSubmit={(e)=>handleSubmit.mutate(e)}>
                    <Form.Control className={input}
                        type="text"
                        placeholder="Category Name"
                        name="name"
                        onChange={handleChange}
                        value={category} />

                    <button className={`mt-4 ${btnSave}`}>
                        Submit
                    </button>
                </Form>
            </Container>

        </div>
    )
}
