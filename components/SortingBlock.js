const Sblock = ({ props }) => {
    return (
        <div style={{
            width: props.width,
            height: props.height,
            background: props.color,
            display: 'inline-block',
            borderRadius: 6,
            //margin: 1,
        }}> 
        </div>
    );
}

export default Sblock