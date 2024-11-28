import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import qureyString from 'query-string';
import axiosClient from '../axiosClient';
import '../styles/filter.css';


const FilterPage = () => {
    const navgivate = useNavigate()
    const [locationData, setlocationData] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const restaurantsPerPage = 2;
    const [sort, setSort] = useState(1);
    const [cusineid, setCuisineid] = useState([]);
    const [lcost, setLcost] = useState(undefined);
    const [hcost, setHcost] = useState(undefined);

    const location = useLocation().search;

    const qs = qureyString.parse(window.location.search);
    const mealtype_id = qs.mealtype;
    const location_id = Number(sessionStorage.getItem('locationID'));
    

    const fetchLocation = () => {
        axiosClient.get('/komato/getAllLocations')
            .then((res) => setlocationData(res.data))
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        fetchLocation();

        const filteredObj = {
            mealtype_id: Number(mealtype_id),
            location_id: location_id,
            cuisine_id: cusineid,
            sort: sort,
            lcost: lcost,
            hcost: hcost
        }
        axiosClient.post("/komato/filter", filteredObj)
            .then(res => setRestaurants(res.data))
            .catch(err => console.log(err))

    }, [location, sort, cusineid, lcost, hcost, location_id, mealtype_id])

    const searchHandle = (e) => {
        var locationids = Number(e.target.values);
        const filteredObj = {
            mealtype_id: Number(mealtype_id),
            location_id: locationids,
            sort: sort,
            lcost: lcost,
            hcost: hcost
        }
        axiosClient.post("/komato/filter", filteredObj)
            .then(res => setRestaurants(res.data))
            .catch(err => console.log(err))
    }

    const filters = () => {
        const filteredObj = {
            mealtype_id: Number(mealtype_id),
            location_id: location_id,
            cuisine_id: cusineid,
            sort: sort,
            lcost: lcost,
            hcost: hcost
        }
        axiosClient.post("/komato/filter", filteredObj)
            .then(res => setRestaurants(res.data))
            .catch(err => console.log(err))
    }

    const handleCuisine = (id) => {
        const index = cusineid.indexOf(id)
        if (index === -1) {
            cusineid.push(id)
            setCuisineid(cusineid)
        } else {
            cusineid.splice(index, 1)
            setCuisineid(cusineid)
        }
        setTimeout(() => {
            filters();
        }, 0);

    }

    const searchSort = (e) => {
        const sort = e.target.value
        setSort(sort)
        setTimeout(() => {
            filters();
        }, 0);
    }

    const handleCost = (lcost, hcost) => {
        setLcost(lcost)
        setHcost(hcost)
        setTimeout(() => {
            filters();
        }, 0);

    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastRestaurant = currentPage * restaurantsPerPage;
    const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
    const length = Math.ceil(restaurants.length / restaurantsPerPage);
    const currentRestaurants = restaurants.length > 0 ? restaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant) : 0;

    const handleDetail = (e) => {
        navgivate(`/detail?resturant=${e._id}`)
    }

    return (
        <div className="back">
            <h1 class="text">Best Restaurants in India</h1>
            <div class="container bx">
                <div class="filter">
                    <h4 >Filters</h4>
                    <select id="city" onChange={searchHandle}>
                        <option>~~Select City~~</option>
                        {locationData.map((e) => {
                            return <option key={e._id} value={e.location_id}>{`${e.city}- ${e.name}`}</option>
                        })}
                    </select>
                </div>

                <div class="cussins d-none d-md-none d-lg-block">
                    <h3 class="selectpart">Cuisine</h3>
                    <input type="checkbox" onChange={() => handleCuisine(1)} /> North Indians<br />
                    <input type="checkbox" onChange={() => handleCuisine(2)} /> South Indians <br />
                    <input type="checkbox" onChange={() => handleCuisine(3)} /> Chinese Food<br />
                    <input type="checkbox" onChange={() => handleCuisine(4)} /> Fast Food<br />
                    <input type="checkbox" onChange={() => handleCuisine(5)} /> Street Food<br />
                    <br />
                    <h3 class="selectpart">Cost for two</h3>
                    <input type="radio" name="price" onChange={() => handleCost(0, 500)} /> Less than &#8377;500<br />
                    <input type="radio" name="price" onChange={() => handleCost(500, 1000)} /> &#8377;500 to &#8377;1000<br />
                    <input type="radio" name="price" onChange={() => handleCost(1000, 1500)} /> &#8377;1000 to &#8377;1500<br />
                    <input type="radio" name="price" onChange={() => handleCost(1500, 2000)} /> &#8377;1500 to &#8377;2000<br />
                    <input type="radio" name="price" onChange={() => handleCost(2000, 50000)} /> &#8377;2000+<br />
                    <br />
                    <h3 class="selectpart">Sort</h3>
                    <input type="radio" name="Sort" id="" value={1} onClick={searchSort} /> Price Low to High<br />
                    <input type="radio" name="Sort" id="" value={-1} onClick={searchSort} /> Price High to Low<br />
                </div>


                <div class="container gt">
                    <div class="row row-cols-1 g-4 my-3">
                        {currentRestaurants.length > 0 ? currentRestaurants.map((item, i) => {
                            return <div class="col g-1 mx-1 my-4 con" key={i} onClick={() => handleDetail(item)}>
                                <img src={item.image} alt="img not found" class="img" />
                                <span class="sub">
                                    <h2>{item.name}</h2>
                                    <br />
                                    <h4>{item.city}</h4>
                                    <h5>{item.locality}</h5>
                                    <hr className='foods' />
                                    <h6 className='foods'>CUISINES: {`  ${item.cuisine.map(e => e.name + " ")}`} </h6>
                                    <h6 className='foods'>COST FOR TWO: &#8377;{item.min_price}</h6>
                                </span>
                            </div>
                        }) : <h1 style={{ color: "red" }}>No Result Found...</h1>}
                    </div>
                    {restaurants.length > 0 ?
                        <div className="btn-group px-3 button">
                            {Array.from({ length }).map((_, index) => (
                                <p key={index}
                                    className={`page-item ${currentPage === index + 1 ? 'active' : ''} btn border-primary btn-light`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    <span className="page-link">{index + 1}</span>
                                </p>
                            ))}
                        </div> : null
                    }
                </div>
            </div>
        </div>
    )
}

export default FilterPage;