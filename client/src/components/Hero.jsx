import React from "react";

import {assets, cities} from "../assets/assets.js";

const Hero = () => {
  return (
    <div class="hero-section">
    <p class="hero-badge">The Ultimate Hotel Experience</p>

    <h1 class="hero-title">
        Discover Your Perfect Gateway Destination
    </h1>

    <p class="hero-desc">
        Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.
    </p>
    <form class="booking-form">

    <div>
        <div class="label-row">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label for="destinationInput">Destination</label>
        </div>
        <input list="destinations" id="destinationInput" type="text" class="input-field" placeholder="Type here" required/>
        <datalist id="destinations">
          {cities.map((city, index)=>(<option value={city} key={index}></option>))}


        </datalist>
    </div>

    <div>
        <div class="label-row">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label for="checkIn">Check in</label>
        </div>
        <input id="checkIn" type="date" class="input-field"/>
    </div>

    <div>
        <div class="label-row">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label for="checkOut">Check out</label>
        </div>
        <input id="checkOut" type="date" class="input-field"/>
    </div>

    <div class="guests-block">
        <label for="guests">Guests</label>
        <input min="1" max="4" id="guests" type="number" class="input-field guests-input" placeholder="0"/>
    </div>

    <button class="search-btn">
        <img src={assets.searchIcon} alt="searchIcon" className="h-7" />
        <span>Search</span>
    </button>

</form>



</div>


  );
}

export default Hero;