import Head from 'next/head';
import Sblock from '../../components/sblock';
import { shuffle, highlight, swap, setIsSorting, setComparisons, setNoBlocks, genBlocks, setBlock, insertBlock } from '../../actions';
import { Component } from 'react';
import { connect } from 'react-redux';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

class Sorting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            b: 10,
        };
        this.bubbleSort = this.bubbleSort.bind(this);
        this.doMergeSort = this.doMergeSort.bind(this);
        this.doQuickSort = this.doQuickSort.bind(this);
        this.insertionSort = this.insertionSort.bind(this);
        this.heapSort = this.heapSort.bind(this);
        this.radixSort = this.radixSort.bind(this);
    }

    sleep() {
        return new Promise(res => {
            setTimeout(() => res(), 1/120);
        });
    }

    async changeColor(i1, i2, color) {
        await this.sleep();
        if (i1!=-1) this.props.highlight(i1, color);
        if (i2!=-1) this.props.highlight(i2, color);
    }

    async bubbleSort() {
        await this.props.setIsSorting(1);
        await this.props.setComparisons(0);

        let last = this.props.sortingState.noBlocks;
        while (this.props.sortingState.isSorting) {
            let done = 0;
            let end = 0;
            for (let j = 0; j + 1 < last; j++) {
                if (!this.props.sortingState.isSorting) break;
                if (this.props.sortingState.blocks[j].height > this.props.sortingState.blocks[j + 1].height) {
                    await this.changeColor(j, j+1, 'red');
                    this.props.swap(j, j + 1);
                    done = 1;
                    end = Math.max(end, j + 1);
                } else {
                    await this.changeColor(j, j + 1, 'green');
                }
                await this.changeColor(j, j + 1, 'lightblue');

                this.props.setComparisons(this.props.sortingState.comparisons + 1);
            }
            if (!done) {
                this.props.setIsSorting(0);
            }
            last = end;
        }
    }

    async mergeSort(l, r) {
        if (l>r) return [];
        if (l==r) return [this.props.sortingState.blocks[l]];
        let mid=l+Math.floor((r-l)/2);
        let left=await this.mergeSort(l, mid);
        let right=await this.mergeSort(mid+1, r);
        let i=0, j=0, n=left.length, m=right.length;
        let array=[];
        if (!this.props.sortingState.isSorting) return [];
        while (i<n&&j<m) {
            await this.changeColor(l+i, l+j, 'green');
            if (left[i].height<=right[j].height) {
                this.props.setBlock(l+i+j, left[i]);
                array.push(left[i++]);
                await this.changeColor(l + i-1, l + j, 'lightblue');
            } else {
                this.props.setBlock(l + i + j, right[j]);
                array.push(right[j++]);
                await this.changeColor(l + i, l + j-1, 'lightblue');
            }
            this.props.setComparisons(this.props.sortingState.comparisons+1);
        }
        while (i<n) {
            this.props.setBlock(l + i + j, left[i]);
            array.push(left[i++]);
            this.props.setComparisons(this.props.sortingState.comparisons + 1);
        }
        while (j<m) {
            this.props.setBlock(l + i + j, right[j]);
            array.push(right[j++]);
            this.props.setComparisons(this.props.sortingState.comparisons + 1);
        }
        return array;
    }

    async doMergeSort() {
        await this.props.setIsSorting(1);
        await this.props.setComparisons(0);
        this.mergeSort(0, this.props.sortingState.noBlocks-1);
    }

    async partition(l, r) {
        let pivot = this.props.sortingState.blocks[r];
        let j=l;
        for (let i=l; i<r; i++) {
            if (!this.props.sortingState.isSorting) return 0;
            this.props.setComparisons(this.props.sortingState.comparisons+1);
            await this.changeColor(i, r, 'green');
            if (this.props.sortingState.blocks[i].height<pivot.height) {
                await this.changeColor(i, j, 'red');
                this.props.swap(i, j);
                await this.changeColor(i, j, 'lightblue');
                j++;
            }
            await this.changeColor(i, r, 'lightblue');
        }
        await this.changeColor(j, r, 'red');
        await this.props.swap(j, r);
        await this.changeColor(j, r, 'lightblue');
        return j;
    }

    async quickSort(l, r) {
        if (l>=r||!this.props.sortingState.isSorting) return;
        let pivot = await this.partition(l, r);
        await this.quickSort(l, pivot-1);
        await this.quickSort(pivot+1, r);
    }

    async doQuickSort() {
        await this.props.setIsSorting(1);
        await this.props.setComparisons(0);
        this.quickSort(0, this.props.sortingState.noBlocks - 1);
    }

    async insertionSort() {
        await this.props.setIsSorting(1);
        await this.props.setComparisons(0);
        for (let i=1; i<this.props.sortingState.noBlocks; i++) {
            if (!this.props.sortingState.isSorting) break;
            this.props.setComparisons(this.props.sortingState.comparisons + 1);
            if (this.props.sortingState.blocks[i].height<this.props.sortingState.blocks[i-1].height) {
                let l=0, r=i-1;
                while (l<r) {
                    this.props.setComparisons(this.props.sortingState.comparisons + 1);
                    let mid=l+Math.floor((r-l)/2);
                    await this.changeColor(mid, i, 'green');
                    if (this.props.sortingState.blocks[mid].height<this.props.sortingState.blocks[i].height) {
                        l=mid+1;
                    } else {
                        r=mid;
                    }
                    await this.changeColor(mid, i, 'lightblue');
                }
                await this.props.insertBlock(l, i);
                await this.changeColor(l, -1, 'red');
                await this.changeColor(l, -1, 'lightblue');
            }
        }
    }

    async heapify(n, i) {
        if (!this.props.sortingState.isSorting) return;
        let largest = i;
        let l=2*i+1;
        let r=2*i+2;
        if (l<n) {
            this.props.setComparisons(this.props.sortingState.comparisons + 1);
            await this.changeColor(l, largest, 'green');
            let temp = largest;
            if (this.props.sortingState.blocks[l].height>this.props.sortingState.blocks[largest].height) {
                largest=l;
            }
            await this.changeColor(l, temp, 'lightblue');
        }
        
        if (r<n) {
            this.props.setComparisons(this.props.sortingState.comparisons + 1);
            await this.changeColor(r, largest, 'green');
            let temp = largest;
            if (this.props.sortingState.blocks[r].height>this.props.sortingState.blocks[largest].height) {
                largest=r;
            }
            await this.changeColor(r, temp, 'lightblue');
        }
        
        if (largest!=i) {
            await this.props.swap(largest, i);
            await this.heapify(n, largest);
        }
    }
    
    async heapSort() {
        await this.props.setIsSorting(1);
        await this.props.setComparisons(0);
        let n = this.props.sortingState.noBlocks;
        for (let i = Math.floor(n/2)-1; i>=0; i--) {
            if (!this.props.sortingState.isSorting) break;
            await this.heapify(n, i);
        }
        for (let i=n-1; i>0; i--) {
            if (!this.props.sortingState.isSorting) break;
            await this.changeColor(0, i, 'red');
            await this.props.swap(0, i);
            await this.changeColor(0, i, 'lightblue');
            await this.heapify(i, 0);
        }
    }
    async countingSort(exp) {
        let n = this.props.sortingState.noBlocks;
        let store=Array(n).fill(0);
        let count=Array(10).fill(0);
        for (let i=0; i<n; i++) {
            if (!this.props.sortingState.isSorting) break;
            this.props.setComparisons(this.props.sortingState.comparisons + 1);
            await this.changeColor(-1, i, 'green');
            let h = this.props.sortingState.blocks[i].height;
            count[Math.floor(h/exp)%10]++;
            await this.changeColor(-1, i, 'lightblue');
        }
        for (let i=1; i<10; i++) {
            count[i]+=count[i-1];
        }
        for (let i=n-1; i>=0; i--) {
            if (!this.props.sortingState.isSorting) break;
            this.props.setComparisons(this.props.sortingState.comparisons + 1);
            await this.changeColor(-1, i, 'green');
            let h = this.props.sortingState.blocks[i].height;
            store[--count[Math.floor(h / exp) % 10]] = this.props.sortingState.blocks[i];
            await this.changeColor(-1, i, 'lightblue');
        }
        for (let i=0; i<n; i++) {
            if (!this.props.sortingState.isSorting) break;
            await this.props.setBlock(i, store[i]);
            await this.changeColor(-1, i, 'red');
            await this.changeColor(-1, i, 'lightblue');
        }
    }

    async radixSort() {
        await this.props.setIsSorting(1);
        await this.props.setComparisons(0);
        let max=this.props.sortingState.blocks[0].height;
        for (let i=1; i<this.props.sortingState.noBlocks; i++) {
            max = Math.max(max, this.props.sortingState.blocks[i].height);
        }
        for (let exp=1; Math.floor(max/exp)>0; exp*=10) {
            if (!this.props.sortingState.isSorting) break;
            await this.countingSort(exp);
        }
    }

    render() {
        const state = this.props.sortingState;
        return (
            <>
                <Head>
                    <title>Sort Algos</title>
                </Head>
                <div style={styles.mainContainer}>
                    <div className="sidebar">
                        <RangeSlider
                            value={state.noBlocks}
                            onChange={changeEvent => this.props.setNoBlocks(changeEvent.target.value)}
                            min={2}
                            max={150}
                        />
                        <div style={{marginBottom: 10}}>
                            <span style={{fontSize: 18}}>Comparisons: {state.comparisons}</span>
                        </div>
                        <ul className="nav flex-column" style={styles.column}>
                            <li className="nav-item">
                                <button style={styles.bt} className="btn btn-success" onClick={() => this.props.shuffle()}>
                                    Shuffle Array
                                </button>
                            </li>
                            <li className="nav-item">
                                <button style={styles.bt} className="btn btn-light" onClick={this.bubbleSort}>
                                    Bubble Sort
                                </button>
                            </li>
                            <li className="nav-item">
                                <button style={styles.bt} className="btn btn-light" onClick={this.doMergeSort}>
                                    Merge Sort
                                </button>
                            </li>
                            <li className="nav-item">
                                <button style={styles.bt} className="btn btn-light" onClick={this.doQuickSort}>
                                    Quick Sort
                                </button>
                            </li>
                            <li className="nav-item">
                                <button style={styles.bt} className="btn btn-light" onClick={this.insertionSort}>
                                    Insertion Sort
                                </button>
                            </li>
                            <li className="nav-item">
                                <button style={styles.bt} className="btn btn-light" onClick={this.heapSort}>
                                    Heap Sort
                                </button>
                            </li>
                            <li className="nav-item">
                                <button style={styles.bt} className="btn btn-light" onClick={this.radixSort}>
                                    Radix Sort
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div style={styles.container}>
                        {state.blocks.map((block, i) => (
                            <Sblock props={block} key={i} />
                        ))}
                    </div>
                </div>
            </>
        );
    }
};

const mapStateToProps = state => ({
    sortingState: state.sortingState
});

const mapDispatchToProps = dispatch => {
    return {
        shuffle: (...args) => dispatch(shuffle(...args)), 
        highlight: (...args) => dispatch(highlight(...args)), 
        swap: (...args) => dispatch(swap(...args)), 
        setIsSorting: (...args) => dispatch(setIsSorting(...args)), 
        setComparisons: (...args) => dispatch(setComparisons(...args)),
        genBlocks: (...args) => dispatch(genBlocks(...args)),
        setNoBlocks: (...args) => dispatch(setNoBlocks(...args)),
        setBlock: (...args) => dispatch(setBlock(...args)),
        insertBlock: (...args) => dispatch(insertBlock(...args)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sorting);

const styles = {
    mainContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        //background: 'red',
        height: '100%',
        margin: 50,
        marginTop: 0,
        padding: 20
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        width: 600,
        minWidth: 600,
        margin: 50,
        marginTop: 0,
        marginRight: '15rem',
        height: 300,
    },
    interface: {
        display: 'flex',
        flex: 0.3,
        flexDirection: 'column',
        //background: '#eeeeee',
        outline: 'auto',
        height: '100%',
        padding: 10,
        //width: '100%',
    },
    bt: {
        width: '100%',
        margin: 5
    },
    column: {
        width: 125
    }
};