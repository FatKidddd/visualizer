import Head from 'next/head'
import Link from 'next/link'
import { Container } from 'react-bootstrap';

const Home = () => {
    return (
        <>
            <Head>
                <title>My Garbage</title>
            </Head>
            <Container>
                <h1>Welcome to my garbage dump</h1>
                <p>This will the place for all my visualisation projects</p>
                <div>
                    <Link href="/projects/sorting"><a>Sorting Project</a></Link>
                </div>
            </Container>
        </>
    )
}

export default Home;