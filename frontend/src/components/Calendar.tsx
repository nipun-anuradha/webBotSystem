import React, { useEffect } from 'react'
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
    createViewDay,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
  } from '@schedule-x/calendar'
  import { createEventsServicePlugin } from '@schedule-x/events-service'
  import './index.css'
  import { createEventModalPlugin } from '@schedule-x/event-modal'


const Calendar = () => {
    const [showSearchPopup, setShowSearchPopup] = React.useState<{ // This is the state that will be used to show the appointment model time and date
        show: boolean
        dateTime: string
    }>({
        show: false,
        dateTime: '',
    })
    const plugins = [ // This is the plugins that will be used to create the calendar
        createEventsServicePlugin(),
        createEventModalPlugin(),
    ]
    const calendar = useNextCalendarApp({ // This is the state that will be used to create the calendar
        views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()], // This is the view of the calendar
        callbacks: {
            onClickDateTime(dateTime) {
                setShowSearchPopup({ show: true, dateTime }) // This is the callback function that will be called when the date and time is clicked
            },
        },
        events: [ // This is the events that will be displayed on the calendar
          {
            id: '1',
            title: 'Event 1',
            start: '2024-11-26 00:00',
            end: '2024-11-26 02:40',
          },
          {
            id: '1',
            title: 'Event 1',
            start: '2024-11-28 02:00',
            end: '2024-11-28 04:40',
          },
        ],
        calendars: { // This is the calendar that will be displayed on the calendar
            leisure: {
              colorName: 'leisure',
              lightColors: {
                main: '#FF0000',
                container: '#292929',
                onContainer: '#EFEFEF',
              },
              darkColors: {
                main: '#FF0000',
                container: '#292929',
                onContainer: '#EFEFEF',
              },
            },
          },
      }, plugins)

      useEffect(() => {
        // get all events
        calendar?.events.getAll()
        console.log(showSearchPopup)
      }, [calendar?.events])
  return (
    <>
    <div className='w-full h-full flex flex-col lg:flex-row gap-x-4'>
        <div className='w-full h-full flex flex-col'>
        <ScheduleXCalendar calendarApp={calendar} />
        </div>
        
    </div>
    </>
  )
}

export default Calendar