import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TiPlus } from 'react-icons/ti';
import { LuCalendarDays } from 'react-icons/lu';
import { FaRegCalendarPlus } from 'react-icons/fa';
import { RiArrowUpDownFill } from 'react-icons/ri';
import { FiLink } from 'react-icons/fi';
import { IoMoon } from 'react-icons/io5';
// import { IoSunny } from 'react-icons/io5';
import jsonData from "./timeZonesAbb.json";
// import Navbar from "./components/Navbar";
import useTimeConversion from './utils/useTimeConversion';

import { DndContext, closestCorners } from "@dnd-kit/core";
import Column from "./components/Column";

const App = () => {
  //<--------------NavBar functions from NavBar.jsx starts here----------------->
  const TIMEZONEDB_GETTIMEZONE_URL =
    "http://api.timezonedb.com/v2.1/get-time-zone?";
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedDate = `${
    monthNames[selectedDate.getMonth()]
  } ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleClick = () => {
    const searchQueryExists = checkSearchQueryInJSON(searchText);

    if (searchQueryExists) {
      fetchDataFromJSON(searchText);
    } //else {
    //   callAPI();

    // }
  };

  const checkSearchQueryInJSON = (searchQuery) => {
    const lowercaseSearchQuery = searchQuery.toLowerCase();
    return jsonData.some(
      (item) =>
        item.abbreviation.toLowerCase() === lowercaseSearchQuery ||
        item.fullName.toLowerCase() === lowercaseSearchQuery
    );
  };

  const fetchDataFromJSON = (searchQuery) => {
    const filteredData = jsonData.filter(
      (item) =>
        item.abbreviation === searchQuery || item.fullName === searchQuery
    );
    setListPlace(filteredData);

    setSelectedItem(null);
  };

  const handleItemClick = async (item) => {
    let timeZoneParams;
    // Pass listPlace and selectedItem
    if (item.fullName) {
      // Data fetched from JSON file
      timeZoneParams = {
        key: "5O9MC44X06FZ",
        format: "json",
        by: "zone",
        zone: item.zoneName,
      };
    }

    try {
      let timezone = await getTimeZone(timeZoneParams);

      setSelectedItem(timezone); // <-- Set selectedItem directly to timezone
      console.log("timezone in Navbar:", timezone);
      handleListItemSelect(item, timezone);
      console.log("selected item in Navbar:", selectedItem);
    } catch (error) {
      console.error("Error fetching time zone data:", error);
    }

    setListPlace([]);
  };
  function getTimeZone(timeZoneParams) {
    const getTimeZoneQueryString = new URLSearchParams(
      timeZoneParams
    ).toString();

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    return fetch(
      `${TIMEZONEDB_GETTIMEZONE_URL}${getTimeZoneQueryString}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // Calculate the GMT offset in hours and minutes
        const gmtOffsetHours = Math.floor(Math.abs(result.gmtOffset) / 3600);
        const gmtOffsetMinutes = Math.floor(
          (Math.abs(result.gmtOffset) % 3600) / 60
        );

        // Determine the sign of the GMT offset
        const sign = result.gmtOffset >= 0 ? "+" : "-";

        // Construct the formatted GMT offset string
        const formattedOffset = `${sign}${gmtOffsetHours
          .toString()
          .padStart(2, "0")}:${gmtOffsetMinutes.toString().padStart(2, "0")}`;

        return (
          result.zoneName +
          " " +
          result.formatted +
          " " +
          result.abbreviation +
          " GMT: " +
          formattedOffset
        );
      })
      .catch((err) => {
        console.log("err: ", err);
        return "Time zone could not be fetched at the moment";
      });
  }

  const inputRef = useRef(null);

  // State to store the height of the input field
  const [inputHeight, setInputHeight] = useState(0);

  // Update input height when the component mounts or searchText changes
  useEffect(() => {
    if (inputRef.current) {
      setInputHeight(inputRef.current.clientHeight);
    }
  }, [searchText]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsOpen(false); // Close the calendar after selecting a date
  };
  const arrayMove = (arr, fromIndex, toIndex) => {
    const element = arr[fromIndex];
    const newArray = [...arr];
    newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, element);
    return newArray;
  };

  //<------------ Navbar.jsx ends here ----------->
  
  const [timeComponents, setTimeComponents] = useState([]);

  const handleCloseTimeComponent = (id) => {
    // console.log("Close button clicked");
    setTimeComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { ...component, show: false } : component
      )
    );
  };

  const reverseTimeComponentOrder = () => {
    setTimeComponents((prevComponents) => prevComponents.slice().reverse());
  };

  const getTimeComponentPos = (id) =>
    timeComponents.findIndex((task) => task.id === id);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setTimeComponents((timeComponents) => {
      const originalPos = getTimeComponentPos(active.id);
      const newPos = getTimeComponentPos(over.id);

      return arrayMove(timeComponents, originalPos, newPos);
    });
  };
  const addTimeComponent = (selectedItem, listPlace) => {
    const nextId = timeComponents.length + 1;
    setTimeComponents((prevComponents) => [
      ...prevComponents,
      {
        id: nextId,
        selectedItem: selectedItem,
        listPlace: listPlace,
        show: true,
      }, // Pass selectedItem and uniqueListPlace to TimeComponent
    ]);
  };
  const handleListItemSelect = (listPlace, selectedItem) => {
    setListPlace(listPlace);
    addTimeComponent(selectedItem, listPlace);
  };
  console.log(listPlace);

  return (
    <div>
      {/* <Navbar onReverseOrder={reverseTimeComponentOrder} onListItemSelect={handleListItemSelect}  /> */}
      {/*-------------------- Navbar.jsx code starts here-------------------*/}
      <nav className="navbar mt-4 bg-gray-200 w-full lg:w-4/5 px-4 py-2 mx-auto">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 justify-between items-center">
          {/* Search Input with Plus Button */}
          <div className="relative flex items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Add Time Zone"
              value={searchText}
              className="p-2 pr-12 sm:pr-16 rounded border border-gray-400 focus:outline-none focus:border-blue-500 w-full"
              onChange={handleChange}
            />
            <button
              className="absolute right-0 top-0 bottom-0 px-3 text-blue-500 rounded-r flex items-center justify-center text-lg sm:text-xl"
              onClick={handleClick}
            >
              <TiPlus />
            </button>
            { (
              <ul
                className="absolute left-0 mt-8 w-full bg-white border border-gray-300 rounded"
                style={{
                  zIndex: 9999,
                  top: inputHeight + 10,
                  width: inputRef.current
                    ? inputRef.current.clientWidth
                    : "auto",
                }} // Position the list at the bottom
              >
                {listPlace.map((place) => (
                  <li
                    key={place.id}
                    onClick={() => handleItemClick(place)}
                    className="p-2 cursor-pointer"
                  >
                    {place.fullName && `${place.fullName}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Calendar */}
          <div className="relative flex items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Select Date"
              className="p-2 pr-8 sm:pr-10 rounded border border-gray-400 focus:outline-none focus:border-blue-500 w-full"
              value={formattedDate}
              readOnly
            />

            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              className="cursor-pointer"
              customInput={
                <button
                  className="px-3 text-blue-500 text-lg sm:text-xl"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <LuCalendarDays />
                </button>
              }
            />
          </div>
          {/* Additional Buttons */}
          <div className="lg:mr-20 flex lg:space-x-6 sm:space-x-2 space-x-6">
            <div className="flex items-center">
              <button className="px-3 py-2 border border-black rounded-full">
                <FaRegCalendarPlus className="text-lg sm:text-xl text-blue-500" />
              </button>
            </div>

            <div className="flex items-center">
              <button
                className="px-3 py-2 border border-black rounded-full"
                onClick={reverseTimeComponentOrder}
              >
                <RiArrowUpDownFill className="text-lg sm:text-xl text-blue-500" />
              </button>
            </div>

            <div className="flex items-center">
              <button className="px-3 py-2 border border-black rounded-full">
                <FiLink className="text-lg sm:text-xl text-blue-500" />
              </button>
            </div>

            <div className="flex items-center">
              <button className="px-3 py-2 border border-black rounded-full">
                <IoMoon className="text-lg sm:text-xl text-blue-500" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* -----------NavBar.jsx code ends here-------------*/ }

      <div className="App">
        <DndContext
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <Column
            timeComponents={timeComponents}
            onCloseTimeComponent={handleCloseTimeComponent}
          />
        </DndContext>
      </div>
    </div>
  );
};

export default App;
