import { motion } from "framer-motion";
import { RiCloseLine } from 'react-icons/ri'
import { useNavigate } from "react-router-dom";
import '../Notification.css'



export default function Notification({ notificationWindow, setNotificationWindow, notificationContent }) {

    const navigate = useNavigate()

    const closeNOtificationWindow = () => {
        setNotificationWindow(!notificationWindow)
    }

    const displayNotification = () => {
        if (notificationContent?.type === 1) {
            return <h3 className="margin-top-20">{notificationContent?.senderName} invited you to a trip!</h3>;
        }
        if (notificationContent?.type === 2) {
            return <h3 className="margin-top-20">{notificationContent?.senderName} sent you some money!</h3>;
        } 
        if (notificationContent?.type === 3) {
            return <h3 className="margin-top-20">{notificationContent?.senderName} received your payment</h3>;
        } 
    }

    console.log(notificationContent);


    // useEffect(() => {
    //     console.log('notificationContent', notificationContent);
    // }, [notificationContent])

    const handleClick = () => {
        setNotificationWindow(false)
        navigate('/')
    }


    return (
        <>
            <div class='background'></div>
            <motion.div
                initial={{ scale: 0, y: 0, x: 0 }}
                animate={{ scale: 1, y: 1, x: 1 }}
            >

                <div className="notificationWindow" >

                    <RiCloseLine
                        class='closeAddExpence'
                        size='50px' color='#40394A'
                        onClick={() => closeNOtificationWindow()}
                    />
                    <div className='settlementContainer'>
                        <h2>Hey {notificationContent.receiverName}</h2>
                        {displayNotification()}
                        <button className="submitButton" type='button' onClick={handleClick}>Check out more</button>
                    </div>
                </div>
            </motion.div>

        </>
    )
}
