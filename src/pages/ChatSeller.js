import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Chat from '../components/chat/Chat'
import Contact from '../components/chat/Contact'
import NavbarShop from '../components/NavbarShop'
import pagecss from '../styles/Pages.module.css'

import { io } from 'socket.io-client'
import { UserContext } from '../context/UserContext'
let socket

export default function ChatSeller() {
    const { divMain, } = pagecss

    const [contact, setContact] = useState(null)
    const [contacts, setContacts] = useState([])
    const [messages, setMessages] = useState([])
    const [state] = useContext(UserContext)

    const loadContacts = () => {
        // kirim perintah ke config socket
        socket.emit('load customer contacts')
        // terima perintah dari socket
        socket.on('customer contacts', (data) => {
            let dataContacts = data.map((item) => ({
                ...item,
                message: messages.length > 0 ? messages[messages.length - 1].message : "Click here to start message"
            }))
            setContacts(dataContacts)
            console.log(dataContacts);
        })
    }
    useEffect(() => {
        socket = io( process.env.SERVER_URL , {
            auth: {
                token: localStorage.getItem('token')
            },
            query: {
                id: state.user.id
            }
        })
        socket.on('new message', () => {
            console.log('contact', contact);
            socket.emit('load messages', contact?.id)
        })
        loadContacts()
        loadMessages()

        socket.on('connect_error', (err) => {
            console.log(err.message); // not authorized
        })

        return () => {
            // unmount
            socket.disconnect()
        }
    }, [messages])


    const onClickContact = (data) => {
        setContact(data)
        socket.emit('load messages', data.id)
    }

    const loadMessages = () => {
        socket.on('messages', (data) => {
            if (data.length > 0) {
                const dataMessages = data.map((item) => ({
                    idSender: item.sender.id,
                    message: item.message
                }))
                setMessages(dataMessages)
            }
            loadContacts()

        })
    }

    const onSendMessage = (e) => {
        if (e.key === "Enter") {
            const data = {
                idRecipient: contact.id,
                message: e.target.value
            }
            socket.emit('send message', data)
            e.target.value=""
        }
    }
    return (
        <div className={divMain}>
            <div style={{ paddingTop: "20px" }}>
                <NavbarShop />
            </div>
            <div className='m-5'>
                <Row>
                    <Col md={3} style={{ height: '89.5vh' }} className="px-3 border-end border-dark overflow-auto">
                        <Contact dataContact={contacts} clickContact={onClickContact} contact={contact} />
                    </Col>
                    <Col md={9}>
                        <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage} />
                    </Col>
                </Row>
            </div>
        </div>
    )
}
