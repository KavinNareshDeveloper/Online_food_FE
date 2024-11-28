import React,{useState} from 'react';
import Modal from 'react-modal';

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

export const CheckOut = (props) => {
  
    const [total,setTotal]=useState(props.amount)
    const [paid,setPaidModal] = useState(false);
     
    const handlePay=(e)=>{
       e.preventDefault();
       if(total===0 || ""){
        alert("please select the items")
       }else{
          setPaidModal(true);  
    }
    }

  return (
    <div>
        <form >
        <h1 className='fw-bold' style={{color:'brown'}}>PAYMENT</h1>
        <hr />
        <h1 style={{color:'red'}} value={total} onChange={e=>setTotal(e.target.value)}>Total:  &#8377;{props.amount}</h1>
        <button className='btn btn-outline-danger' onClick={handlePay}>Pay</button>

        </form>

        <Modal isOpen={paid} style={customStyles}>
          <h4 style={{ color: 'rgb(128, 0, 0)' }} className='fw-bold'>Payment Received</h4>
          <h3 style={{ color: 'rgb(128, 0, 0)' }} className='fw-bold'>ThankYou for Your Order!!!</h3>
        </Modal>  
    </div>
  )
}