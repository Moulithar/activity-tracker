import React, { useRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import dayjs from "dayjs";
import ExamplePopover from "./Popover";

function Calendar() {
  const calendarRef = useRef(null);
  const externalEventsRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
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
  const handleAddEvent = (eventTitle, eventDescription) => {
    setEvents([
      ...events,
      {
        id: events.length + 1,
        title: eventTitle,
        description: eventDescription,
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
            description: eventEl.dataset.eventDescription,
            allDay: true,
          };
        },
      });
    }
  }, []);

  return (
    <div style={{ display: "flex" , background: "linear-gradient(120deg, #43A047, #8BC34A, #C8E6C9)", padding: "8px"}}>
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
              minWidth: "35vw",
              // minHeight: "35vh",
              display: "flex",
            }}
          >
            <div style={{ width: "100%" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newEventTitle.trim()) {
                    handleAddEvent(newEventTitle, newEventDescription);
                    setNewEventTitle("");
                    setNewEventDescription("");
                    setShowModal(false);
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    alignSelf: "stretch",
                    flex: 1,
                  }}
                >
                  <input
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    autoFocus
                    placeholder="Enter event name"
                    style={{
                      padding: "8px",
                      borderRadius: "3px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <textarea
                    value={newEventDescription}
                    rows={4}
                    onChange={(e) => setNewEventDescription(e.target.value)}
                    autoFocus
                    placeholder="Enter description"
                    style={{
                      padding: "8px",
                      borderRadius: "3px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "16px",
                      alignSelf: "flex-end",
                    }}
                  >
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
                        setNewEventDescription("");
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
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* External Events List */}
      <div
        ref={externalEventsRef}
        style={{
          padding: "15px",

          border: "1px solid #eee",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "200px",
      
        }}
      >
        {/* <pre>{JSON.stringify(events, null, 2)}</pre> */}

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
              data-event-description={event.description || ""}
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

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            height: "23px",
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          dayMaxEvents={4}
          moreLinkContent={() => "Show more"}
          editable={true}
          selectable={true}
          droppable={true}
          eventDrop={(info) => {
            const localDate = dayjs(info.event.start).format("YYYY-MM-DD");
            const updatedEvent = {
              id: parseInt(info.event.id),
              title: info.event.title,
              description: info.event.extendedProps.description,
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
              description: eventEl.dataset.eventDescription,
              start: localDate,
            };
            handleEventReceive(newEvent);
          }}
          eventStartEditable={true}
          dateClick={(date) => console.log("Date clicked:", date)}
          eventClick={(info) => console.log("Event clicked:", info.event.title)}
          eventContent={(arg) => (
            <>
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

              <ExamplePopover Trigger={<div>...</div>}>
                <div style={{ maxHeight: "100px", overflow: "scroll" }}>
                  <h1 style={{ width: "50%" }}>
                    {arg.event.extendedProps.description}
                  </h1>
                  <ExamplePopover Trigger={<div>show list</div>}>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div key={index} onClick={() => alert("clicked")}>
                        List Item {index + 1}
                      </div>
                    ))}
                  </ExamplePopover>
                </div>
              </ExamplePopover>
            </>
          )}
        />
    </div>
  );
}

export default Calendar;

// useEffect(() => {
//   // const fetchEvents = async () => {
//   //   try {
//   //     const res = await fetch("http://localhost:4000/events");
//   //     const json = await res.json();
//   //     setEvents(json);
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };
//   // fetchEvents();
// }, []);
