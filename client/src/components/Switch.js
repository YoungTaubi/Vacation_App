import '../Switch.css';

export default function Switch({checked, handleChange, id, paied, receiverId, receiverName, type}) {

    return (
        <>
            <label className='switch'>
                <input 
                type='checkbox' 
                checked={checked}
                onChange={() => handleChange(id, paied, receiverId, receiverName, type)}
                />
                <span className='slider'/>
            </label>
        </>
    )
}