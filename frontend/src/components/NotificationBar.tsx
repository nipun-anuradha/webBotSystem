import { useState } from 'react'
import { closeIcon } from '../data'

interface NotificationBarProps {
    open: boolean
    onClose: () => void
}

const NotificationBar = ({ open, onClose }: NotificationBarProps) => {
    const [sampleNotifications, setSampleNotifications] = useState([ // This is the state that will be used to store the notifications
        {
            id: 1,
            title: 'New Notification',
            message: 'This is a new notification message, This is a new notification message, This is a new notification message',
            date: '2024-12-01',
            time: '5 minutes ago',
            isNew: true
        },
        {
            id: 2,
            title: 'New Notification',
            message: 'This is a new notification message',
            date: '2024-12-01',
            time: '15 minutes ago',
            isNew: true
        },
        {
            id: 3,
            title: 'Another Notification',
            message: 'This is another notification message',
            date: '2024-12-02',
            time: '1 hour ago',
            isNew: false
        },
        {
            id: 4,
            title: 'Final Notification',
            message: 'This is the final notification message',
            date: '2024-12-03',
            time: '2 hour ago',
            isNew: false
        },
        {
            id: 5,
            title: 'New Notification',
            message: 'This is a new notification message',
            date: '2024-12-01',
            time: '5 hours ago',
            isNew: false
        },
        {
            id: 6,
            title: 'Another Notification',
            message: 'This is another notification message',
            date: '2024-12-02',
            time: '6 hour ago',
            isNew: false
        },
        {
            id: 7,
            title: 'Final Notification',
            message: 'This is the final notification message',
            date: '2024-12-03',
            time: '10 hour ago',
            isNew: false
        }
    ])
  return (
    <div className={`w-full md:w-[calc(50vw)] lg:w-[calc(40vw)] xl:w-[calc(30vw)] z-[15000] shadow-lg drop-shadow-lg md:rounded-l-[16px] border-white border-[2px] h-[calc(100vh)] flex flex-col gap-1 transition-all transform ease-in-out duration-300 fixed top-0 right-0 bg-white ${open ? 'translate-x-0' : 'translate-x-[calc(200vw)] md:translate-x-[calc(60vw)]'}`}>
        <div className='w-full flex flex-row items-center justify-center p-4 border-b-[2px] border-b-[#efefef]'>
            <h1 className='text-[#292929] text-[16px] font-semibold'>Notifications</h1>
            <button onClick={onClose} className='ml-auto'>
                <img src={closeIcon} alt='icon' className='w-[24px] h-[24px]' />
            </button>
        </div>
        <div className='w-full flex flex-col gap-1 h-full overflow-y-auto transparent-scrollbar'>
            {
                sampleNotifications.map((notification) => (
                    <div 
                    key={notification.id} 
                    onClick={() => {
                        // set is new to false
                        const updatedNotifications = sampleNotifications.map((n) => {
                            if (n.id === notification.id) {
                                n.isNew = false
                            }
                            return n
                        })
                        setSampleNotifications(updatedNotifications)
                    }}
                    className={`w-full p-4 border-b-[2px] ${notification.isNew ? 'bg-[#efefef]' : 'bg-white'} cursor-pointer border-b-[#efefef] flex flex-row justify-between items-center`}>
                        <div className='w-[calc(100%-20px)] sm:w-[calc(100%-50px)] flex flex-col'>
                        <div className='flex flex-row gap-x-2 items-end'>
                        <p className='text-[#292929] text-[16px] font-semibold'>{notification.title}
                        <span className='text-gray-500 text-[14px] font-normal pl-2'>{notification.message}</span>
                        </p>
                        
                        </div>
                        <div className='flex flex-row gap-x-2 pt-2 items-center text-gray-500'>
                            <p className=' text-[14px]'>{notification.date}</p>
                            <div className='size-2 rounded-full bg-gray-500' />
                            <p className=' text-[14px]'>{notification.time}</p>
                        </div>
                        </div>
                        { notification.isNew &&
                            <div className='w-[20px] sm:w-[50px] h-full items-center justify-center flex'>
                            <div className='size-2 rounded-full bg-primary'  />
                        </div>
                        }
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default NotificationBar