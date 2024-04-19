import React from 'react'
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TimeComponent from './TimeComponent';

const Column = ({timeComponents, onCloseTimeComponent}) => {
  
  return (
    <div className="column">
        <SortableContext items={timeComponents} strategy={verticalListSortingStrategy}>
        {timeComponents.map((component, index) => (
          component.show && (
            <TimeComponent
              key={component.id}
              id={component.id}
              onClose={onCloseTimeComponent}
              listPlace={component.listPlace}
              selectedItem={component.selectedItem}
              
            />
          )
        ))}
        </SortableContext>
    </div>
  )
}

export default Column