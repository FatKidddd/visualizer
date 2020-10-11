//import styles from './layout.module.css'
import { Navbar, Nav } from "react-bootstrap";

const Layout = ({ children }) => { 
    return (
        <body>
            <Navbar expand="lg" bg="dark" variant="dark" style={{marginBottom: 50}}>
                <Navbar.Brand>Penis</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/projects/sorting">Sorting</Nav.Link>
                </Nav>
            </Navbar>
            {children}
        </body>
    )
}

export default Layout