import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Table, Modal, Form } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import NavbarShop from '../components/NavbarShop'
import { API } from '../config/api'
import pagecss from '../styles/Pages.module.css'
import productcss from '../styles/Product.module.css'

export default function EditCategory() {
    const { divMain,
        headingWhite, } = pagecss
    const { input, btnSave } = productcss
    const [form, setForm] = useState({
        name: ""
    })
    const { id } = useParams()
    const navigate = useNavigate()
    
    // handle change
    const handleChange = (e) => {
        setForm({
            ...form,
            name: e.target.value
        })
    }
    let { data: categoriesData, refetch } = useQuery('categoriesCache', async () => {
        const response = await API.get(`/category/${id}`)
        return response.data.data
    })

    useEffect(() => {
        if (categoriesData) {
            setForm({
                ...form,
                name: categoriesData.name
            })
        }
    }, [categoriesData])
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
            console.log(body);
            // insert data
            const response = await API.patch(`/category/${id}`, body, config)
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
                <h4 className={headingWhite}>Edit Category</h4>
                <Form className='mt-5' onSubmit={(e)=>handleSubmit.mutate(e)}>
                    <Form.Control className={input}
                        type="text"
                        placeholder="Category Name"
                        name="name"
                        onChange={handleChange}
                        value={form?.name} />

                    <button type='submit' className={`mt-4 ${btnSave}`}>
                        Save
                    </button>
                </Form>
            </Container>

        </div>
    )
}
