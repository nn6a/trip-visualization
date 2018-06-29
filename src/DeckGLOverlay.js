import DeckGL, {ScatterplotLayer} from 'deck.gl';
import React, {Component} from 'react';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

export default class DeckGLOverlay extends Component {
    render() {
        if (!this.props.data) {
            return null;
        }

        const layers = [
            new ScatterplotLayer({
                id: 'scatterplot',
                data: this.props.data,
                getPosition: d => d.position,
                getColor: d => d.pickup ? PICKUP_COLOR : DROPOFF_COLOR,
                opacity: 0.5,
                radiusScale: this.props.settings.radiusScale,
                radiusMinPixels: 0.25,
                radiusMaxPixels: 30,
                pickable: true,
                onHover: hover => this.props.onHover(hover)
            })
        ];

        return (
            <DeckGL {...this.props.viewport} layers={layers} onWebGLInitialized={this._initialize}/>
        );
    }
}
