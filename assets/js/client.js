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

  };