import React, { useState } from 'react'
import Navbar from './components/Navbar'

import {DndContext,closestCorners} from "@dnd-kit/core"
import Column from './components/Column';


const App = () => {
  const arrayMove = (arr, fromIndex, toIndex) => {
    const element = arr[fromIndex];
    const newArray = [...arr];
    newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, element);
    return newArray;
  };
  const [uniqueListPlace, setUniqueListPlace] = useState(null);
  const [timeComponents, setTimeComponents] = useState([
    {id: 1, show:true, selectedItem: "Asia/Kolkata 2024-04-18 09:58:45 IST GMT: +05:30", uniqueListPlace: {}},
    {id: 2, show:true, selectedItem: "Asia/Kolkata 2024-04-18 09:58:45  GMT: +06:30", uniqueListPlace: {}}
  ]);

  

  const handleCloseTimeComponent = (id) => {
    console.log("Close button clicked");
    setTimeComponents(prevComponents =>
      prevComponents.map(component =>
        component.id === id ? { ...component, show: false } : component
      )
    );
  };

  const reverseTimeComponentOrder = () => {
    setTimeComponents(prevComponents =>
      prevComponents.slice().reverse()
    );
  };

  const getTimeComponentPos = id => timeComponents.findIndex(task=> task.id === id)

  const handleDragEnd = event =>{
    const {active,over} = event;

    if(active.id === over.id) return;

    setTimeComponents(timeComponents =>{
      const originalPos = getTimeComponentPos(active.id);
      const newPos = getTimeComponentPos(over.id);

      return arrayMove(timeComponents, originalPos, newPos);

    })
  }
  const addTimeComponent = (selectedItem, uniqueListPlace) => {
    console.log("selectedItem" , selectedItem);
    console.log("UniqueListPlace", uniqueListPlace);
    const nextId = timeComponents.length + 1;
    setTimeComponents((prevComponents) => [
      ...prevComponents,
      { id: nextId, selectedItem: selectedItem, uniqueListPlace: uniqueListPlace }, // Pass selectedItem and uniqueListPlace to TimeComponent
    ]);
  };
  const handleListItemSelect = (listPlace, selectedItem) => {
    console.log("List Item Clicked");
    setUniqueListPlace(listPlace);
    addTimeComponent(selectedItem, listPlace); // Pass selectedItem and uniqueListPlace when adding a TimeComponent
  };

  return (
    <div>
      <Navbar onReverseOrder={reverseTimeComponentOrder} onListItemSelect={handleListItemSelect}  />
      <div className="App">
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
          <Column timeComponents={timeComponents} onCloseTimeComponent={handleCloseTimeComponent} />

        </DndContext>
        
        
        
      </div>
    
      
    </div>
  )
}

export default App