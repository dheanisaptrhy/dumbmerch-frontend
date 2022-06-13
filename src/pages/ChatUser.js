import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Chat from '../components/chat/Chat'
import Contact from '../components/chat/Contact'

import pagecss from '../styles/Pages.module.css'
import Navbar from '../components/Navbar'

import { io } from 'socket.io-client'
import { UserContext } from '../context/UserContext'

let socket

export default function ChatUser() {
    const { divMain, } = pagecss

    const [contact, setContact] = useState(null)
    const [contacts, setContacts] = useState([])

    const [messages, setMessages] = useState([])
    const [state] = useContext(UserContext)

    useEffect(() => {
        socket = io('http://localhost:3500/', {
            auth: {
                token: localStorage.getItem('token')
            }, query: {
                id: state.user.id
            }
        })


        socket.on('new message', () => {
            console.log('contact: ', contact);
            socket.emit('load messages', contact?.id)
        })

        socket.on('connect_error', (err) => {
            console.log(err.message); // not authorized
        })
        loadContacts()
        loadMessages()

        return () => {
            // unmount
            socket.disconnect()
        }
    }, [messages])

    const loadContacts = () => {
        // kirim perintah ke config socket
        socket.emit('load admin contact')
        // terima perintah dari socket
        socket.on('admin contact', (data) => {
            let dataContacts = {
                ...data,
                message: messages.length > 0 ? messages[messages.length - 1].message : "Click here to start message"
            }

            setContacts([dataContacts])
            console.log(dataContacts);
        })
    }

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
        })
    }

    // onmessage
    const onSendMessage = (e) => {
        if (e.key == 'Enter') {
            const data = {
                idRecipient: contact.id,
                message: e.target.value
            }
            socket.emit('send message', data)
            e.target.value = ""
        }
    }

    return (
        <div className={divMain}>
            <div style={{ paddingTop: "20px" }}>
                <Navbar />
            </div>
            <div className='m-5'>
                <Row>
                    <Col md={3} style={{ height: '89.5vh' }} className="px-3 border-end border-dark overflow-auto">
                        <Contact dataContact={contacts} clickContact={onClickContact} contact={contact} />
                    </Col>
                    <Col md={7}>
                        <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage} />
                    </Col>
                </Row>
            </div>

        </div>
    )
}
