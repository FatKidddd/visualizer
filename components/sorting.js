import { Component } from 'react'
import Sblock from './sblock'

const width=500;
const height=300;

class Sorting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noBlocks: 100,
            blocks: [],
        };
        this.genBlocks();
        this.shuffleBlocks();
    }

    genBlocks() {
        this.state.blocks = [];
        let w=width/(this.state.noBlocks+1);
        let h=height/this.state.noBlocks;
        for (let i=0; i<this.state.noBlocks; i++) {
            this.state.blocks.push(<Sblock width={w} height={h*(i+1)} />);
        };
    }

    shuffleBlocks() {
        let currentIdx=this.state.blocks.length, tempVal, randIdx;
        while (0!=currentIdx) {
            randIdx=Math.floor(Math.random()*currentIdx);
            currentIdx--;
            tempVal=this.state.blocks[currentIdx];
            this.state.blocks[currentIdx]=this.state.blocks[randIdx];
            this.state.blocks[randIdx]=tempVal;
        }
    }

    render () {
        return (
            <div style={styles.container}>
                {this.state.blocks}
            </div>
        )
    }
}
export default Sorting

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        flex: 2,
        //width: '100%',
        marginLeft: 100,
        height: '100%',
    },
};