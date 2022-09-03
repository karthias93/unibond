import React from 'react';
import VirtualScrollChild from './VirtualScrollChild';
import InfiniteScroll from './InfiniteScroll';

/**
 * A wrapper component for implementing virtual and
 * infinite scrolling.
 */
function VirtualAndInfiniteScroll({listItems, height, lastRowHandler}) {
    const VirtualScrollChildren = listItems.map((listItem, i) => 
        <VirtualScrollChild height={height} key={i}>{listItem}</VirtualScrollChild>
    );

    return (
        <InfiniteScroll 
            listItems={VirtualScrollChildren} 
            lastRowHandler={lastRowHandler}/>
    );
}

export default VirtualAndInfiniteScroll; 