import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Table, Modal, Form } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import CheckBox from '../components/CheckBox'
import NavbarShop from '../components/NavbarShop'
import { API } from '../config/api'
import pagecss from '../styles/Pages.module.css'
import productcss from '../styles/Product.module.css'

export default function EditProduct() {
    const { divMain,
        headingWhite, btnActionUpload} = pagecss
    const { input, btnSave } = productcss

    const navigate = useNavigate()
    const { id } = useParams()

    const [form, setForm] = useState({
        title: "",
        desc: "",
        price: "",
        qty: "",
        image: ""
    })
    const [preview, setPreview] = useState(null)
    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState([])
    const [product, setProduct] = useState({})

    //fetch and refetch
    let { data: products, refetch } = useQuery('productCache', async () => {
        const response = await API.get(`/product/${id}`)
        return response.data.data
    })
    let { data: categoriesData, refetch: refetchCategories } = useQuery('categoriesCache', async () => {
        const response = await API.get('/categories')
        return response.data.data
    })

    useEffect(() => {
        if (products) {
            setPreview(products.image)
            setForm({
                ...form,
                title: products.title,
                desc: products.desc,
                price: products.price,
                qty: products.qty,
            })
            setProduct(products)
        }
        if (categoriesData) {
            setCategories(categoriesData)
        }
    }, [products])

    // handle change
    const handleChangeCategoryId = (e) => {
        const id = e.target.value
        const checked = e.target.checked

        if (checked == true) {
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
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === 'file' ? e.target.files : e.target.value,
        });

        // Create image url for preview
        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
    }

    // handle submit
    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                }
            }

            // form data
            const formData = new FormData()
            if (form.image) {
                formData.set('image', form?.image[0], form?.image[0]?.name)
            }
            formData.set('title', form.title)
            formData.set('desc', form.desc)
            formData.set('price', form.price)
            formData.set('qty', form.qty)
            formData.set('categoryId', categoryId)

            const response = await API.patch(`/product/${product.id}`, formData, config)
            console.log(response.data.data);

            navigate('/product')
        } catch (error) {
            console.log(error);
        }
    })

    // category checked
    useEffect(() => {
        const newCategoryId = product?.categories?.map((item) => {
            return item.id
        })
        setCategoryId(newCategoryId)
    }, [product])

    return (
        <div className={divMain}>
            <div style={{ paddingTop: "20px" }}>
                <NavbarShop />
            </div>
            <Container className='mt-5'>
                <h4 className={headingWhite}>Edit Product</h4>
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
                        hidden />

                    <Form.Control className={input}
                        type="text"
                        placeholder="Product Name"
                        name="title"
                        onChange={handleChange}
                        value={form?.title} />

                    <Form.Control className={input}
                        as="textArea"
                        rows={3}
                        placeholder="Desc product"
                        name="desc"
                        onChange={handleChange}
                        value={form?.desc} />

                    <Form.Control className={input}
                        type="number"
                        placeholder="Price"
                        name="price"
                        onChange={handleChange}
                        value={form?.price} />

                    <Form.Control className={input}
                        type="number"
                        placeholder="Qty"
                        name="qty"
                        onChange={handleChange}
                        value={form?.qty} />

                    <div className={input}>
                        <div>
                            <h5 className={headingWhite}>Category</h5>
                        </div>
                        <div>
                            {product &&
                                categories?.map((item, index) => (
                                    <label key={index} className={`d-flex ${headingWhite} `}>
                                        <CheckBox
                                        categoryId={categoryId}
                                        value={item?.id}
                                        handleChangeCategoryId={handleChangeCategoryId}/>
                                        {item?.name}
                                    </label>
                                ))}
                        </div>
                    </div>

                    <button className={`mt-4 ${btnSave}`}>
                        Save
                    </button>
                </Form>
            </Container>

        </div>
    )
}
