var Calendar = function() {

   var layOutDay = function(events) {
     var eventsLength = events.length;
     var timeslots = [];
     var event, i, j;
     
     // Step 0: Sort events by id.
     events = events.sort(function(a, b){return a.id - b.id;});
     
     // Step 1: Initialize timeslots.
     for (i=0; i<1440; i++) {
       timeslots[i] = [];
     }
     
     // Step 2: Arrange the events by timeslot.
     for (i = 0; i < eventsLength; i++) {
       event = events[i];
       
       // Safety first.
       if (event.start > event.end) {
         var temp = event.start;
         event.start = event.end;
         event.end = temp;
       }
       
       for (j=event.start; j<event.end; j++) {
         timeslots[j].push(event.id);
       }
     }
     
     // Step 3: Get each event it's horizontal position,
     //         and figure out the max number of conflicts it has.
     for (i=0; i<1440; i++) {
       var next_hindex = 0;
       var timeslotLength = timeslots[i].length;
       
       // If there's at least one event in the timeslot,
       // we know how many events we will have going across for that slot.
       if (timeslotLength > 0) {
         
         // Store the greatest concurrent event count (cevc) for each event.
         for (j=0; j<timeslotLength; j++) {
           event = events[timeslots[i][j]-1];
           
           if (!event.cevc || event.cevc < timeslotLength) {
             event.cevc = timeslotLength;
             
             // Now is also a good time to coordinate horizontal ordering.
             // If this is our first conflict, start at the current index.
             if (!event.hindex) {
               event.hindex = next_hindex;
               
               // We also want to boost the index,
               // so that whoever we conflict with doesn't get the same one.
               next_hindex++;
             }
           }
         }
       }
     }
     
     // Step 4: Calculate event coordinates and dimensions,
     // and generate DOM.
     for (i=0; i<events.length; i++) {
       event = events[i];
       
       // Height and y-coordinate are already known.
       event.pxh = event.end - event.start;
       event.pxy = event.start;
       
       // Width is based on calendar width and the cevc.
       event.pxw = 600 / event.cevc;
       
       // Height uses the same calendar/cevc figure,
       // multiplied by the horizontal index to prevent overlap.
       event.pxx = event.hindex * event.pxw;
       
       // Now, the easy part.
       var div = document.createElement("div");
       div.style.width = event.pxw + "px";
       div.style.height = event.pxh + "px";
       div.style.top = event.pxy + "px";
       div.style.left = event.pxx + "px";
       div.style.position = "absolute";
       div.style.background = "#"+Math.floor(Math.random()*16777215).toString(16);
       // (random colours will make the events easy to tell apart.)
       
       console.log(document);
       document.getElementById("calander").appendChild(div);
     }
   };

  
    return {
        layOutDay : layOutDay
    };

}();

var events = [
 {id : 1, start : 60, end : 150},  // an event from 10am to 11:30am
 {id : 2, start : 540, end : 570}, // an event from 6pm to 6:30pm
 {id : 3, start : 555, end : 600}, // an event from 6:15pm to 7pm
 {id : 4, start : 585, end : 660} // an event from 6:45pm to 8pm
];

// call now
Calendar.layOutDay(events);