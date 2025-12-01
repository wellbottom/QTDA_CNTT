import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UseAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';

const HotelListComponent = ({ hotelList, setSelectedHotel, selectedHotel }) => {
    return (
        <StyledWrapper>
            <div className="radio-input">
                {hotelList && hotelList.map((hotel) => (
                    <label key={hotel._id}>
                        <input 
                            type="radio" 
                            id={`hotel-${hotel._id}`} 
                            name="value-radio" 
                            value={hotel._id}
                            checked={selectedHotel === hotel._id}
                            onChange={(e) => {setSelectedHotel(e.target.value); console.log("From the component, setSelectedHotel complete " + hotel.name)}}
                        />
                        <span>{hotel.name}</span>
                    </label>
                ))}
                <span className="selection" />
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .radio-input input {
    display: none;
  }

  .radio-input {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    width: fit-content;
  }

  .radio-input label {
    position: relative;
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #f5f5f5;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .radio-input label:hover {
    background-color: #efefef;
    border-color: #0b75df;
  }

  .radio-input input:checked + span {
    color: #0b75df;
    font-weight: 600;
  }

  .radio-input label:has(input:checked) {
    background-color: #e3f2fd;
    border-color: #0b75df;
    box-shadow: 0 0 0 3px rgba(11, 117, 223, 0.1);
  }

  .radio-input input[type="radio"]::before {
    content: '';
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid #999;
    border-radius: 50%;
    background-color: #fff;
  }

  .radio-input input:checked[type="radio"]::before {
    border-color: #0b75df;
    box-shadow: inset 0 0 0 4px #0b75df;
  }

  .selection {
    display: none;
  }`;

export default HotelListComponent;
