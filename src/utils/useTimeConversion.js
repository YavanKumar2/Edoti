import { useEffect, useState } from "react";





  const useTimeConversion = (extractedDate, changedFor, selectedHour, istValues) => {
    const [convertedTimes, setConvertedTimes] = useState([]);
  
    useEffect(() => {
        function convertToIST(selectedDate, timeChangedFor, timeChangedTo, selectedItems) {
            // Step 1: Calculate timeChangedTo with respect to IST
            const istOffset = selectedItems.find(item => item.abbreviation === timeChangedFor).gmtOffset;
            const [hoursOffset, minutesOffset] = istOffset.split(':').map(Number);
            const timeParts = timeChangedTo.match(/(\d+):(\d+)(?::(\d+))? (am|pm)/i);
            console.log("timechangedto",timeChangedTo)
            console.log("Time parts ni use",timeParts)
            if (!timeParts) {
              throw new Error("Invalid time format");
            }
            let [hours, minutes, seconds] = timeParts.slice(1, 4).map(Number);
            const meridian = timeParts[4].toLowerCase();
            if (meridian === 'pm' && hours !== 12) {
              hours += 12;
            } else if (meridian === 'am' && hours === 12) {
              hours = 0;
            }
            hours -= hoursOffset;
            minutes -= minutesOffset;
            if (minutes < 0) {
              hours--;
              minutes += 60;
            }
            if (hours < 0) {
              hours += 24;
              selectedDate.setDate(selectedDate.getDate() - 1);
            }
            const timeIST = new Date(selectedDate);
            timeIST.setHours(hours, minutes, seconds);
          
            // Step 2: Calculate times for other time zones
            const result = selectedItems
              .filter(item => item.abbreviation !== timeChangedFor)
              .map(item => {
                const [hoursOffset, minutesOffset] = item.gmtOffset.split(':').map(Number);
                let time = new Date(timeIST);
                time.setHours(time.getHours() + hoursOffset);
                time.setMinutes(time.getMinutes() + minutesOffset);
                // Adjust date for time zones with negative offsets
                if (hoursOffset < 0 && time.getHours() >= 24) {
                  time.setDate(time.getDate() + 1);
                }
                return {
                  abbreviation: item.abbreviation,
                  date: time.toDateString(),
                  time: time.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })
                };
              });
          
            return result;
          }
      // Check if all required data is available
      if (extractedDate && changedFor && selectedHour !== null && istValues.length > 0) {
        // Extract the time string from the selectedHour
        const hours = Math.floor(selectedHour / 60);
        const minutes = selectedHour % 60;
        const timeChangedTo = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00 ${hours < 12 ? "am" : "pm"}`;
  
        // Call the convertToIST function
        const convertedData = convertToIST(new Date(extractedDate), changedFor, timeChangedTo, istValues);
        setConvertedTimes(convertedData);
      }
    }, [extractedDate, changedFor, selectedHour, istValues]);
  
    return convertedTimes;
  };
  
  export default useTimeConversion;