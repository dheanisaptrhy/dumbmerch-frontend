import React, { useState } from 'react'
import { Button, Card, Container, Table, Modal, Row, Col } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import NavbarShop from '../components/NavbarShop'
import { API } from '../config/api'
import category from '../data/category'
import pagecss from '../styles/Pages.module.css'
import productcss from '../styles/Product.module.css'

export default function CategoryList() {
    const { divMain,
        headingWhite,
        btnActionDelete,
        headingBlack,
        btnActionEdit,
        btnActionAdd } = pagecss
    const { btnNo, btnYes } = productcss
    const navigate = useNavigate()

    // open modal delete
    const [show, setShow] = useState(false)
    const [idDelete, setIdDelete] = useState(null)
    const handleShow = () => {
        setShow(true)
    }
    const handleClose = () => {
        setShow(false)
    }

    // fetch data
    let { data: categories, refetch } = useQuery('categoriesCache', async () => {
        const response = await API.get('/categories')
        return response.data.data
    })

    // handle delete
    const handleDelete = (id) => {
        setIdDelete(id)
        handleShow()
    }

    // handle update data
    const handleUpdate = (id)=>{
        navigate(`/editcategory/${id}`)
    }

    const deleteById = useMutation(async (id) => {
        try {
            await API.delete(`/category/${id}`)
            refetch()
        } catch (error) {
            console.log(error);
        }
    })
    const handleConfirmDelete = () => {
        deleteById.mutate(idDelete)
        handleClose()
    }
    return (
        <div className={divMain}>
            <div style={{ paddingTop: "20px" }}>
                <NavbarShop />
            </div>
            <Container className='mt-5'>
                <Row>
                    <Col xs={10}>
                        <h4 className={headingWhite}>List Category</h4>
                    </Col>
                    <Col xs={2}>
                        <button className={btnActionAdd}
                            onClick={() => navigate('/addcategory')}>Add</button>
                    </Col>
                </Row>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Category Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.map((data, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{data.name}</td>
                                <td>
                                    <button className={btnActionEdit}
                                        onClick={() => handleUpdate(data.id)}>Edit</button>
                                    <button className={btnActionDelete} onClick={() => handleDelete(data.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body>
                    <h4 className={headingBlack}>Delete Data</h4>
                    <p>Are you sure want to delete this data?</p>
                    <div className='d-flex justify-content-end'>
                        <button className={btnYes} onClick={handleConfirmDelete}>Yes</button>
                        <button className={btnNo} onClick={handleClose}>No</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
