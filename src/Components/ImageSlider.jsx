import React from 'react'
import SimpleImageSlider from "react-simple-image-slider";
import slider from '../asserts/slider.jpg';
import slider1 from '../asserts/slider1.jpg';
import slider2 from '../asserts/slider2.jpg';
import slider3 from '../asserts/slider3.jpg';
import slider4 from '../asserts/slider4.jpg';


export const ImageSlider = () => {
    const sliderImages =[
        {url:slider}, {url:slider1}, {url:slider2}, {url:slider3}, {url:slider4}
    ];

  return (
    <div>
         <SimpleImageSlider width={"80%"} height={500} images={sliderImages} showNavs={true} autoPlay={true} paddingRight={"100px"}/>
    </div>
  )
}