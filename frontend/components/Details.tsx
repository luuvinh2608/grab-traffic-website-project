'use client';
import { useAppDispatch, useAppSelector } from '@/libs/redux';
import { setShowDetails } from '@/libs/redux/slicePages';
import React, { useState, useRef } from 'react';
import { FaTimes, FaChevronRight } from 'react-icons/fa';

export const Details = () => {
  const dispatch = useAppDispatch();
  const { showDetails, district } = useAppSelector((state) => state.page);
  const className =
    'bg-white transition-[margin-right] ease-in-out duration-500 fixed md:static top-0 bottom-0 right-0 z-40 p-4 w-[526px] text-black';
  const appendClass = showDetails ? ' mr-0' : ' mr-[-250px]';
  return (
    <div className={`${className}${appendClass}`}>
      <div className="flex flex-col">
        <div className="flex justify-between mb-6">
          {/* dummy div to center the text */}
          <div></div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold">{district}</h2>
            <p className="text-xs leading-3">11:09PM, Th04 06 2024</p>
          </div>
          <button
            onClick={() => {
              dispatch(setShowDetails({ showDetails: false, district: null }));
            }}
            className="text-xl font-bold"
          >
            <FaChevronRight />
          </button>
        </div>
        <h3 className="text-lg font-bold uppercase">Air Quality</h3>
        <div className="flex flex-col p-4 bg-green-500 rounded-md text-white">
          <div className="flex justify-center items-end align-bottom">
            <h4 className="text-7xl font-semibold">50<span className="text-xl font-light">AQI</span></h4>
          </div>
          <div className='flex flex-row items-center justify-around bg-white rounded-md p-2 ml-4 text-green-700'>
              <p className="text-base font-semibold">PM2.5</p>
              <p className="text-base">11.9µg/m³</p>
            </div>
        </div>
      </div>
    </div>
  );
};
