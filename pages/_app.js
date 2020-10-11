import { Provider } from 'react-redux'
import { useStore } from '../store'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from "react-bootstrap";
import Link from 'next/link';

export default function App({ Component, pageProps }) {
	const store = useStore(pageProps.initialReduxState)
	
	return (
		<Provider store={store}>
			<Navbar expand="lg" bg="dark" variant="dark" style={{ marginBottom: 50 }}>
				<Navbar.Brand>
					<div style={{borderRadius: 20, width: 40, overflow: 'hidden'}}>
						<img src="/tenor.gif" style={{width:'auto', height: 40}}/>
					</div>
				</Navbar.Brand>
				<Nav className="mr-auto">
					<Nav.Link><Link href="/"><span>Home</span></Link></Nav.Link>
					<Nav.Link><Link href="/projects/sorting"><span>Sorting</span></Link></Nav.Link>
				</Nav>
			</Navbar>
			<Component {...pageProps} />
		</Provider>
	)
};