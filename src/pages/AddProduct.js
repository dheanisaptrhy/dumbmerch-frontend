import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Table, Modal, Form } from 'react-bootstrap'
import NavbarShop from '../components/NavbarShop'
import pagecss from '../styles/Pages.module.css'
import productcss from '../styles/Product.module.css'

import { useMutation } from 'react-query'
import { API } from '../config/api'
import { useNavigate } from 'react-router-dom'

export default function AddProduct() {
    const { divMain,
        headingWhite,btnActionUpload } = pagecss
    const { input, btnSave } = productcss
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState([])
    const [preview, setPreview] = useState(null)
    const [form, setForm] = useState({
        title: "",
        desc: "",
        price: "",
        qty: "",
        image: ""
    })
    // const { name, desc, price, qty, image } = form

    // fetch category
    const getCategories = async () => {
        try {
            const response = await API.get('/categories')
            setCategories(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }
    // handle change form
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:  e.target.type === 'file' ? e.target.files : e.target.value,
        })

        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }
    }

    const handleChangeCategoryId = (e) => {
        const id = e.target.value
        const checked = e.target.checked

        if (checked) {
            // save category
            setCategoryId([...categoryId, parseInt(id)])
            console.log(categoryId);
        } else {
            // delete category if unchecked
            let newCategoryId = categoryId.filter((categoryIdItem) => {
                return categoryIdItem != id
            })
            setCategoryId(newCategoryId)
        }
    }

    // handle submit
    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            };

            const formData = new FormData()
            formData.set('image', form.image[0], form.image[0].name)
            formData.set('title', form.title)
            formData.set('desc', form.desc)
            formData.set('price', form.price)
            formData.set('qty', form.qty)
            formData.set('categoryId', categoryId)

            const response = await API.post('/product', formData, config)
            console.log(response.data.data);

            navigate('/product')
        } catch (error) {
            console.log(error);
        }
    })

    useEffect(() => {
        getCategories()
    }, [])


    return (
        <div className={divMain}>
            <div style={{ paddingTop: "20px" }}>
                <NavbarShop />
            </div>
            <Container className='mt-5'>
                <h4 className={headingWhite}>Add Product</h4>
                <Form className='mt-5' onSubmit={(e) => handleSubmit.mutate(e)}>
                    {preview && (
                        <div>
                            <img
                                src={preview}
                                style={{
                                    maxWidth: '100px',
                                    maxHeight: '100px',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    )}
                    <label for="image" className={btnActionUpload}>
                        Upload file
                    </label>
                    <Form.File className={input}
                        type="file"
                        id="image"
                        placeholder="Upload Image"
                        name="image"
                        onChange={handleChange}
                        hidden/>

                    <Form.Control className={input}
                        type="text"
                        placeholder="Product Name"
                        name="title"
                        onChange={handleChange}/>

                    <Form.Control className={input}
                        as="textArea"
                        rows={3}
                        placeholder="Desc product"
                        name="desc"
                        onChange={handleChange}/>

                    <Form.Control className={input}
                        type="number"
                        placeholder="Price"
                        name="price"
                        onChange={handleChange}/>

                    <Form.Control className={input}
                        type="number"
                        placeholder="Qty"
                        name="qty"
                        onChange={handleChange}/>
                    <div className={input}>
                        <div>
                            <h5 className={headingWhite}>Category</h5>

                        </div>
                        <div>
                            {categories?.map((item, index) => (
                                <label key={index} className={`d-flex ${headingWhite} `}>
                                    <Form.Check
                                        type='checkbox'
                                        value={item?.id}
                                        onClick={handleChangeCategoryId} />
                                    {item?.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button className={`mt-4 ${btnSave}`}>
                        Submit
                    </button>
                </Form>
            </Container>

        </div>
    )
}
