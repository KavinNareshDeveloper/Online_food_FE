import React, { useEffect, useState } from "react";
import "../styles/wallpaper.css";
import axiosClient from "../axiosClient";
import { useNavigate } from 'react-router-dom';

const QuickSearch = () => {
    const navigate = useNavigate();
    const [mealtypes, setMealtypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const navigateFilter =(mealtypeid)=>{
        var locId= sessionStorage.getItem("locationID")
        if(locId){
            navigate(`/filter?mealtype=${mealtypeid}&location=${locId}`)
        }else{
            navigate(`/filter?mealtype=${mealtypeid}`)
        }
        
    }

    useEffect(() => {
        const fetchMealtypes = async () => {
            try {
                const response = await axiosClient.get('/komato/getAllMealtype');
                setMealtypes(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }   
        };


        fetchMealtypes();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <div className="quicksearch">
                <p className="quicksearchHeading">Quick Searches</p>
                <p className="quicksearchSubHeading">
                    Discover restaurants by type of meal
                </p>

                <div className="container-fluid mt-5">
                    <div className="row">
                        {mealtypes.map((mealtype) => (
                            <div className="col-sm-6 col-md-4 col-lg-4" key={mealtype.id}  onClick={()=>navigateFilter(mealtype.mealtype_id)}>
                                <div className="titleContainer">
                                    <div className="titleComponent1">
                                        <img src={mealtype.image} height="145" width="160" alt={mealtype.name} />
                                    </div>

                                    <div className="titleComponent2">
                                        <div className="componentHeading">
                                            {mealtype.name}
                                        </div>

                                        <div className="componentSubHeading">
                                            {mealtype.content}
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickSearch;
