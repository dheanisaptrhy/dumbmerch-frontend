import React, { useEffect, useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import Navbar from '../components/Navbar'
import pagecss from '../styles/Pages.module.css'
import mouse from '../assets/mouse.png'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { API } from '../config/api'

export default function DetailPage() {
    const { divMain, headingRed, textWhite, btnRedFull } = pagecss
    const { id } = useParams()
    const navigate = useNavigate()
    // const [detail, setDetail] = useState([])

    let { data: products, refetch } = useQuery('productCache', async () => {
        const response = await API.get(`/product/${id}`)
        return response.data.data
    })

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = "Client key here ...";

        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);

    const handleBuy = useMutation(async () => {
        try {
          // Get data from product
          const data = {
            idProduct: products.id,
            idSeller: products.user.id,
            price: products.price,
          };
    
          // Data body
          const body = JSON.stringify(data);
    
          // Configuration
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
    
          // Insert transaction data
          const response = await API.post("/transaction", body, config);
          // console.log(response.data);
          // Create variabel for store token payment from response here ...
          const token = response.data.payment.token;
    
          // Init Snap for display payment page with token here ...
          window.snap.pay(token, {
            onSuccess: function (result) {
              /* You may add your own implementation here */
              console.log(result);
              navigate("/profile");
            },
            onPending: function (result) {
              /* You may add your own implementation here */
              console.log(result);
              navigate("/profile");
            },
            onError: function (result) {
              /* You may add your own implementation here */
              console.log(result);
            },
            onClose: async ()=> {
              /* You may add your own implementation here */
              try {
                const deleteTransaction = await API.delete(`/transaction/${response.data.data.id}`)
                alert("you closed the popup without finishing the payment");
              } catch (error) {
                console.log(error);
              }
            },
          });
    
        } catch (error) {
          console.log(error);
        }
      });

    return (
        <div className={divMain}>
            <div style={{ paddingTop: "20px" }}>
                <Navbar />
            </div>
            <Container className='mt-5'>
                <Row>
                    <Col>
                        <div style={{ display: "flex", justifyContent: "end" }}>
                            <img src={products?.image} style={{ width: '20rem', height: '25rem' }} />
                        </div>
                    </Col>
                    <Col>
                        <div style={{ width: "85%" }}>
                            <h3 className={headingRed}>{products?.title}</h3>
                            <p className={textWhite}>Stock : {products?.qty} </p>
                            <p className={textWhite}>{products?.desc}</p>
                            <h5 className={`mt-3 mb-3 ${headingRed}`} style={{ display: "flex", justifyContent: "end" }}>Rp.{products?.price}</h5>
                            <button className={btnRedFull}
                            onClick={()=>handleBuy.mutate()}
                            >Buy</button>
                        </div>
                    </Col>
                </Row>

            </Container>
        </div>
    )
}
