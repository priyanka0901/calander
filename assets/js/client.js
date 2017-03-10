var Calendar = function() {

   var layOutDay = function(events) {
     var eventsLength = events.length;
     var timeslots = [];
     var previouswidth = 0;
     var incmeter = 0;
     var event, i, j, previouscevc;
     
     
     // Step 0: Sort events by id.
     for(var i = 0; i < events.length; i++){
        events[i].id = i+1;
     }
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
     previouscevc = events[0].cevc;
     for (i=0; i<events.length; i++) {
       event = events[i];
       
       // Height and y-coordinate are already known.
       event.pxh = event.end - event.start;
       event.pxy = event.start;
       
       // Width is based on calendar width and the cevc.
       event.pxw = 600 / event.cevc;
       // console.log(event.cevc);
       // console.log(event.pxw);
       // console.log(event.hindex);
       
       // Height uses the same calendar/cevc figure,
       // multiplied by the horizontal index to prevent overlap.
       
       if(previouscevc == event.cevc){
          // debugger;
          event.pxx = previouswidth * incmeter;
          previouswidth = event.pxw ? event.pxw : 0;
          incmeter++;
       }else{
          event.pxx = 0;
          previouswidth = event.pxx;
          incmeter = 0;
          event.pxx = previouswidth * incmeter;
          previouswidth = event.pxw ? event.pxw : 0;
          incmeter++;
       }
       previouscevc = event.cevc;
       // console.log(event.pxw);
       // console.log('current incmeter  ', incmeter);
       // console.log('event cevc  ', event.cevc);
       // console.log('final pxx   ', event.pxx);
       // console.log('   ');
       // console.log('   ');
       
       // Now, the easy part.
       var div = document.createElement("div");
       div.style.width = event.pxw + "px";
       div.style.height = event.pxh + "px";
       div.style.top = event.pxy + "px";
       div.style.left = event.pxx + "px";
       div.style.position = "absolute";
       div.style.background = "#"+Math.floor(Math.random()*16777215).toString(16);
       // (random colours will make the events easy to tell apart.)
       
       // console.log(document);
       document.getElementById("calander").appendChild(div);
     }
   };

  
    return {
        layOutDay : layOutDay
    };

}();

var events = [
 {id : 10, start :0,"end":90},
 {id : 13, start :0,"end":90},
 {id : 11, start :15,"end":90},
 {id : 12, start :60,"end":90},
 {id : 14, start :60,"end":180},
 {id : 15, start :120,"end":150},
 {id : 16, start :135,"end":165},
 {id : 18, start :195,"end":240},
 {id : 17, start :225,"end":285},
 {id : 19, start :465,"end":645}
];

// call now
Calendar.layOutDay(events);