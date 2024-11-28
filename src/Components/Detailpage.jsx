import React, { useEffect, useState } from 'react'
import '../styles/detail.css';
import { ImageSlider } from './ImageSlider';
import { Tab, TabList, Tabs, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Modal from 'react-modal';
import queryString from 'query-string';
import { CheckOut } from './CheckOut';
import axiosClient from '../axiosClient';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgb(192, 192, 192)',
        textAlign: 'center',
        borderRadius: '10px 10px 10px 10px'
    }
};

const DetatilPage = () => {

    const [resturant, setResturant] = useState([]);
    const [gallaryIsOpen, setGallaryIsOpen] = useState(false);
    const [menu, setMenu] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [count, setCount] = useState({});
    const [paymentModal, setPaymentModal] = useState(false)
    const parsed = queryString.parse(window.location.search);
    const id = parsed.resturant;

    useEffect(() => {
        
        axiosClient.get(`/komato/restById/${id}`)
            .then((res) => {
                setResturant(res.data);
            })

        axiosClient.get(`/komato/menu/${resturant.name}`)
            .then((res) => {
                setMenu(res.data);
            })
    }, [resturant.name,id])


    const gallaryOpen = () => {
        setGallaryIsOpen(true);
        axiosClient.get(`/komato/menu/${resturant.name}`)
            .then((res) => {
                setMenu(res.data);
            })
    }

    const handleIncrement = (selectItem, index) => {

        if (selectItem) {
            setCount((pre) => {
                const newCount = { ...pre, [index]: (pre[index] || 0) + 1 };
                setQuantity(pre => parseFloat(pre + selectItem.price))
                return newCount
            })
        }
    };

    const paymentIsOpen = () => {
        setGallaryIsOpen(false);
        setPaymentModal(true);
    }

    const handleDecrement = (selectItem, index) => {

        if (selectItem && quantity > 0 && count[index] > 0) {

            setCount(pre => {
                const newCount = { ...pre, [index]: pre[index] - 1 };
                setQuantity(pre => pre - selectItem.price);
                return newCount
            })
        }
    };

    const cashOnDelivery = () => {
        setGallaryIsOpen(false);
        alert("Order Accepted.. wait for few minutes...")
    }

    const exitClose =() => {
        alert("Are You Sure to Close this Modal")
        setGallaryIsOpen(false);
    }

    return (
        <div>
            <div className='border border-5 rounded-3 detail'>
                <h2 className="det">Details of the Restaurant</h2>

                <div className='rounded-3 slider'>    
                    <ImageSlider />
                    <br />
                    <div className='d-flex justify-content-between'>
                        <h1 className='line text-start'>{resturant.name}</h1>
                        <button className='btn-outline-danger bttn' onClick={gallaryOpen}>Place Your Order</button>
                    </div>
                </div>

                <div>
                    <Tabs  className='border border-2 rounded-3'>
                        <TabList  className="d-flex flex-row">
                            <Tab style={{ backgroundColor: "brown" }}><h3 style={{ color: "white" }}>Overview</h3></Tab>
                            <Tab style={{ backgroundColor: "brown" }}><h3 style={{ color: "white" }}>Contact</h3></Tab>
                        </TabList>
                        <TabPanel>
                            <h3 style={{ color: "red", fontWeight: "bolder" }} >Overview</h3>
                            <h6 style={{ width: "50%", margin: "auto", color: "brown" }}>
                                <h2>{resturant.name}</h2>
                                <h4>{`Ratting : ${resturant.rating_text}`}</h4>
                                <h4>{`City: ${resturant.city}`}</h4>
                            </h6>
                        </TabPanel>
                        <TabPanel>
                            <h2 style={{ color: "red", fontWeight: "bolder" }}>Contact Details</h2>
                            <h3 style={{ color: "brown", fontWeight: "bolder" }}>{resturant.name}</h3>
                            <h4 style={{ color: "brown", fontWeight: "bolder" }}>Area : {resturant.locality}</h4>
                            <h4 style={{ color: "brown", fontWeight: "bolder" }}>City : {resturant.city}</h4>
                            <h4 style={{ color: "brown", fontWeight: "bolder" }}>Contact Number : {resturant.contact_number}</h4>
                            
                        </TabPanel>
                    </Tabs>
                    <br />
                </div>
            </div>
            <br /><br />

            <Modal isOpen={gallaryIsOpen} style={customStyles}>
                {menu.map(e => {
                    return <div>
                        <h1 style={{ color: 'rgb(128, 0, 0)' }} className='fw-bold'>{e.name.toUpperCase()} Menus</h1>
                        <hr className='foods' />
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.80)', width: '100%', borderRadius: '8px' }}>

                            <div >
                                {e.item.map((a, index) =>
                                (
                                    <span className='d-flex justify-content-between p-2' key={index}>
                                        <p style={{ color: 'rgb(0, 255, 127)', fontSize: '13px' }} className='px-4 fst-italic'>
        
                                             <h3 style={{ color: 'rgb(255, 69, 0)' }} className='fw-bold'>{a.name}</h3> 
                                             {a.desc}  
                                        </p>
                                        <div className='d-flex justify-content-evenly px-4' style={{ width: '180px', border: 'none' }}>
                                            <button className='btn btn-outline-warning fs-6 fw-bold' onClick={() => handleDecrement(a, index)}>-</button>
                                            <button className='fw-bold fs-6 text-center btn btn-outline-success'>{count[index] || 0}</button>
                                            <button className='btn btn-outline-warning fs-6 fw-bold' onClick={() => handleIncrement(a, index)}>+</button>
                                        </div>
                                        <h4 className='py-3' style={{ color: 'rgb(255, 69, 0)' }}>&#8377; {a.price}</h4>
                                    </span>
                                )
                                )}
                            </div>
                        </div>
                        <hr />
                        <h1 style={{ color: 'black', marginLeft: "40%" }} className='px-3 py-1'>SubTotal: &#8377; {quantity || e.amount}</h1>
                        <div className='d-flex justify-content-end '>
                            <button className='btn btn-outline-success fs-5 fw-bold' onClick={paymentIsOpen}>Pay Online</button>
                            <button className='btn btn-outline-success fs-5 fw-bold mx-2' onClick={cashOnDelivery} >Cash On Delivery</button>
                            <button className='btn btn-outline-success fs-5 fw-bold mx-2' onClick={exitClose} >Exit</button>
                        </div>
                    </div>
                }
                )}
            </Modal>
            
            <Modal isOpen={paymentModal} style={customStyles}>
                <CheckOut amount={quantity} id={id} />
            </Modal>

        </div>
    )
}

export default DetatilPage;






































