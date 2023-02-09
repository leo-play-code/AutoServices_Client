import React, { Component } from 'react';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';

class DragComponent extends Component {
    handleDragStart(event) {
    // This method runs when the dragging starts
        console.log("Started")
    }

    handleDrag(event) {
    // This method runs when the component is being dragged
    console.log("Dragging...")
    }

    handleDragEnd(event) {
    // This method runs when the dragging stops
        console.log("Ended")
    }

    render() {
    return (
        <Box
            draggable
            onDragStart={this.handleDragStart}
            onDrag={this.handleDrag}
            onDragEnd={this.handleDragEnd}
        >
            |
        </Box>
    );
    }
}




// export default DragComponent;