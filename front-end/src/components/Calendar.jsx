import React, { useRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import dayjs from "dayjs";

function Calendar() {
  const calendarRef = useRef(null);
  const externalEventsRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [events, setEvents] = useState([]);

  // Handle when an existing event is moved
  const handleEventDrop = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleEventReceive = (newEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === newEvent.id ? newEvent : event))
    );
  };

  // Handle adding a new event
  const handleAddEvent = (eventTitle) => {
    setEvents([
      ...events,
      {
        id: events.length + 1,
        title: eventTitle,
      },
    ]);
  };

  useEffect(() => {
    if (externalEventsRef.current) {
      new Draggable(externalEventsRef.current, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          return {
            title: eventEl.dataset.eventTitle,
            allDay: true,
          };
        },
      });
    }
  }, []);

  return (
    <div style={{ display: "flex", margin: "0 auto" }}>
      {showModal && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <form onSubmit={(e) => {
                e.preventDefault();
                if (newEventTitle.trim()) {
                  handleAddEvent(newEventTitle);
                  setNewEventTitle("");
                  setShowModal(false);
                }
            }}>
              <input
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                autoFocus
              placeholder="Enter event name"
              style={{
                padding: "8px",
                marginRight: "10px",
                borderRadius: "3px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 15px",
                backgroundColor: "#3788d8",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Add Event
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setNewEventTitle("");
                setShowModal(false);
              }}
              style={{
                padding: "8px 15px",
                marginLeft: "10px",
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </form>
          </div>
        </div>
      )}

      {/* External Events List */}
      <div
        ref={externalEventsRef}
        style={{
          padding: "15px",
          marginBottom: "20px",
          border: "1px solid #eee",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          minWidth: "200px",
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Add Event
        </button>

        {events
          .filter((e) => !e.start)
          .map((event, index) => (
            <div
              key={event.id}
              className="fc-event"
              data-event-id={event.id}
              data-event-title={event.title}
              style={{
                padding: "5px 10px",
                margin: "5px 0",
                backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                color: "white",
                cursor: "move",
                borderRadius: "3px",
              }}
            >
              {event.title}
            </div>
          ))}
      </div>

      <div style={{ width: "100%" }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          editable={true}
          selectable={true}
          droppable={true}
          eventDrop={(info) => {
            const localDate = dayjs(info.event.start).format("YYYY-MM-DD");
            const updatedEvent = {
              id: parseInt(info.event.id),
              title: info.event.title,
              start: localDate,
            };
            handleEventDrop(updatedEvent);
          }}
          eventReceive={(info) => {
            const eventEl = info.draggedEl;
            const localDate = dayjs(info.event.start).format("YYYY-MM-DD");
            const newEvent = {
              id: parseInt(eventEl.dataset.eventId),
              title: eventEl.dataset.eventTitle,
              start: localDate,
            };
            handleEventReceive(newEvent);
          }}
          dateClick={(date) => console.log("Date clicked:", date)}
          eventClick={(info) => console.log("Event clicked:", info.event.title)}
          eventContent={(arg) => (
            <div
              style={{
                padding: "2px 5px",
                borderRadius: "3px",
                backgroundColor: arg.backgroundColor,
                color: "white",
                fontSize: "0.9em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {arg.event.title}
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default Calendar;
