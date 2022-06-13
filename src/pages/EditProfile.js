import React, { useContext, useEffect, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { API } from '../config/api'
import { UserContext } from '../context/UserContext'
import pagecss from '../styles/Pages.module.css'
import productcss from '../styles/Product.module.css'

export default function EditProfile() {
    const { divMain, btnActionUpload, btnRedFull } = pagecss
    const { input, btnSave } = productcss

    const { id } = useParams()
    const navigate = useNavigate()
    const [preview, setPreview] = useState(null)
    const [state, dispatch] = useContext(UserContext)
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        image: ""
    })
    
    let { data: profile, refetch } = useQuery('usercache', async () => {
        const response = await API.get(`/profile/${state.user.id}`)
        console.log(state.user);
        return response.data.data
    })

    useEffect(() => {
        if (profile) {
            setPreview(profile.image)
            setForm({
                ...form,
                name: state.user.name,
                email: state.user.email,
                phone: profile.phone,
                gender: profile.gender,
                address: profile.address
            })
        }
    }, [profile])

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

    // 
    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                }
            }

            const formData = new FormData()
            if (form.image) {
                formData.set('image', form?.image[0], form?.image[0]?.name)
            }
            formData.set('name', form.name)
            formData.set('email', form.email)
            formData.set('phone', form.phone)
            formData.set('gender', form.gender)
            formData.set('address', form.address)

            const response = await API.patch(`/profile/${state.user.id}`, formData, config)
            console.log(response.data.data);

            navigate('/profile')
        } catch (error) {
            console.log(error);
        }
    })

    return (
        <div className={divMain}>
            <div style={{ paddingTop: "20px" }}>
                <Navbar />
            </div>
            <Container className='d-flex justify-content-center align-items-center'
            >
                <div style={{ width: "50%" }}>
                    <Form className='mt-5 ' onSubmit={(e) => handleSubmit.mutate(e)}>
                        <div className='d-flex justify-content-center align-items-center mb-3'>
                            {preview && (
                                <div>
                                    <img
                                        src={preview}
                                        style={{
                                            maxWidth: '13rem',
                                            maxHeight: '13rem',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            )}

                            <div className='d-flex justify-content-center align-items-center'>
                                <label for="image" className={`ms-3 ${btnActionUpload}`}>
                                    Change Photo Profile
                                </label>
                            </div>
                        </div>
                        <Form.File
                            type="file"
                            id="image"
                            placeholder="Upload Image"
                            name="image"
                            onChange={handleChange}
                            hidden />

                        <Form.Control className={input}
                            type="text"
                            placeholder="Name"
                            name="name"
                            onChange={handleChange}
                            value={form?.name} />

                        <Form.Control className={input}
                            type="text"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={form?.email} />

                        <Form.Control className={input}
                            type="text"
                            placeholder="Phone"
                            name="phone"
                            onChange={handleChange}
                            value={form?.phone} />

                        <Form.Control className={input}
                            type="text"
                            placeholder="Gender"
                            name="gender"
                            onChange={handleChange}
                            value={form?.gender} />

                        <Form.Control className={input}
                            type="text"
                            placeholder="Address"
                            name="address"
                            onChange={handleChange}
                            value={form?.address} />

                        <button className={btnRedFull} style={{ marginTop: '10px' }}
                        >
                            Save
                        </button>
                    </Form>
                </div>
            </Container>
        </div>
    )
}
