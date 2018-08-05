import DeckGL, {ScatterplotLayer, PathLayer} from 'deck.gl';
import React, {Component} from 'react';

export default class DeckGLOverlay extends Component {
    render() {
        if (!this.props.timelineData && !this.props.pointData) {
            return null;
        }

        const layers = [
            new PathLayer({
                id: 'timeline-layer',
                data: this.props.timelineData,
                opacity: 0.5,
                pickable: false,
                widthScale: 2,
                widthMinPixels: 2,
                getPath: d => d.path,
                getColor: d => d.color,
            }),
            new ScatterplotLayer({
                id: 'point-layer',
                data: this.props.pointData,
                pickable: true,
                opacity: 1,
                radiusScale: 50,
                radiusMaxPixels: 25,
                radiusMinPixels: 1,
                getPosition: d => [d.longitude, d.latitude, 30],
                getColor: d => [0, 128, 255],
                onClick: d => this.props.onPointClick(d.object)
            })
        ];

        return (
            <DeckGL {...this.props.viewport} layers={layers}/>
        );
    }
}
