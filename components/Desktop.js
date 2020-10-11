import { useMediaQuery } from 'react-responsive';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 814 });
    return isDesktop ? children : <div style={{padding: 20}}>Enlarge your window</div>;
};

export default Desktop;