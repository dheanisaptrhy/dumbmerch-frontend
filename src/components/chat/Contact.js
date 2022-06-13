import React from 'react'
import image from '../../assets/taehyun.png'
import chatcss from '../../styles/Chat.module.css'

export default function Contact({ dataContact, clickContact, contact }) {
    const { contactName, text } = chatcss

    // const clickContact = (id) => {
    //     const data = dataContact.find((item) => item.id == id)
    //     setContact(data)
    // }

    return (
        <>
            {dataContact.length > 0 && (
                <>
                    {dataContact?.map((item) => (
                        <div
                            key={item.id}
                            className={`d-flex align-items-center ${contact?.id == item?.id
                                }`}
                            onClick={() => {
                                clickContact(item)
                            }}
                        >
                            <img src={item.profile?.image} className='rounded-circle' style={{
                                width: "70px", height: "70px", objectFit: "cover"
                            }} />
                            <div className='ms-4'>
                                <ul>
                                    <li className={contactName}>{item.name}</li>
                                    <li className={text}>{item.message}</li>
                                </ul>
                                {/* <h5 className={contactName}>Dhimas</h5>
                        <p className={text}>How Are you?</p> */}
                            </div>
                        </div>
                    ))}
                </>
            )}

        </>

    )
}
