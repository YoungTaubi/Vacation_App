import '../Switch.css';

export default function Switch(props) {

    return (
        <>
            <label className='switch'>
                <input 
                type='checkbox' 
                checked={props.checked}
                onChange={() => props.handleChange(props.id, props.paied)}
                />
                <span className='slider'/>
            </label>
        </>
    )
}