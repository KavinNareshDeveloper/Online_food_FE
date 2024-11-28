import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../axiosClient';
import "../styles/wallpaper.css";

const Wallpaper = () => {
    const naviagte = useNavigate();
    const [location, setLocation] = useState([]);
    const [rest, setRest] = useState([]);
    const[locationid,setLocationid]= useState([])
    const [inputtext, setInputtext] = useState('');
    const [suggestion, setSuggestion] = useState([]);
    const [fill,setFill]= useState([]);
    
    const fetchLocation = () => {
        axiosClient.get('/komato/getAllLocations')
            .then((res) => setLocation(res.data))
            .catch((err) => console.log(err))
    }

    const fetchRest = () => {
        axiosClient.get(`/komato/getAllRest`)
            .then((res) => setRest(res.data))
    }

    useEffect(() => {
        sessionStorage.clear();
        fetchLocation();
        fetchRest();

    }, []);

    const handleLocationChange = (e) => {
        let locationId = e.target.value;  
        const [value1,value2]=locationId.split(",")
        sessionStorage.setItem("city",value2)    
        sessionStorage.setItem("locationID",Number(value1))
        
        axiosClient.get(`/komato/restByLocationId/${value1}`)
            .then((res) => {
                setLocationid(res.data);
                console.log(locationid);
            });

        axiosClient.get(`/komato/restBycity/${value2}`)
            .then((res) => setFill(res.data),
            console.log(fill)
            );  
       
    }
  
    const handleSearch = (e) => {
        let inputText = e.target.value;
        const suggestion = rest.filter(e => e.name.toLowerCase().includes(inputText.toLowerCase()));
        setInputtext(inputText);
        setSuggestion(suggestion)
    }

    const selectingRest = (restObj) => {
        naviagte(`/detail?resturant=${restObj._id}`);
    }

    const showSuggestion = () => {
        if (suggestion.length === 0 && inputtext === undefined) {
            return null;
        }
        if (suggestion.length > 0 && inputtext === '') {
            return null;
        }
        if (suggestion.length === 0 && inputtext) {
            return <ul>
                <li>No Search Result Found</li>
            </ul>
        }
        return (
            <ul>
                {suggestion.map((e, i) => (<li key={i} onClick={() => selectingRest(e)} >{`${e.name}- ${e.locality},${e.city}  `}</li>)) }
            </ul>
        )
    }

    return (
        <div>
            <img src="./Assets/slider.jpg" height="430" width="100%" alt="Slider" />
            <div>
                <div className="logo">
                    <p>K</p>
                </div>

                <div className="headings">
                    Find the Best Restaurants, Cafes, Bars
                </div>

                <div className="locationSelector">
                    <select className="locationDropdown"  onChange={handleLocationChange}>
                        <option className="opt">Select City</option>
                            {location.map(loc => (
                            <option key={loc.location_id} value={loc.location_id}>
                            {`${loc.name}, ${loc.city}`}
                        </option>
                        ))}
                    </select>

                    <div>
                        <span className="glyphicon glyphicon-search search"></span>
                        <div id="notebooks">
                            <input id="query" className="restaurantsinput" type="text" placeholder="Please Enter Restaurant Name" onChange={handleSearch}/>
                            {showSuggestion()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wallpaper;