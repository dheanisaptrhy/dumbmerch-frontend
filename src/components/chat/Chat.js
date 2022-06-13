import React from 'react'
import { Image } from 'react-bootstrap'
import image from '../../assets/taehyun.png'
import chatcss from '../../styles/Chat.module.css'

export default function Chat({ contact, user, messages, sendMessage }) {
    const { chatBoxSeller, chatBoxBuyer, inputMessage } = chatcss
    return (
        <>
            {contact ? (
                <>
                    <div style={{ height: "60vh" }} className="overflow-auto px-3 py-2">
                        {messages.map((item, index) => (
                            <div key={index}>
                                <div className={`d-flex py-1 ${item.idSender === user.id ? "justify-content-end" : "justify-content-start"} `}>
                                    {item.idSender !== user.id && (
                                        <img src={contact.profile?.image} className='rounded-circle' style={{
                                            width: "50px", height: "50px", objectFit: "cover"
                                        }} />
                                    )}
                                    {/* <div style={{color:"white"}}>meong</div> */}
                                    <div className={item.idSender === user.id ? chatBoxSeller : chatBoxBuyer}>
                                        {item.message}
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                    <div style={{ height: '6vh' }} className='px-3'>
                        <input
                            placeholder='Send Message'
                            className={`mt-4 ${inputMessage}`}
                            onKeyPress={sendMessage} />
                    </div>
                </>
            ) : (
                <div
                    style={{ height: "89.5vh" }}
                    className="h4 d-flex justify-content-center align-items-center"
                >
                    No Message
                </div>
            )}


        </>
    )
}
