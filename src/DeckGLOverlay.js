import DeckGL, {ScatterplotLayer, HexagonLayer, PathLayer} from 'deck.gl';
import React, {Component} from 'react';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

// in RGB
const HEATMAP_COLORS = [
    [213, 62, 79],
    [252, 141, 89],
    [254, 224, 139],
    [230, 245, 152],
    [153, 213, 148],
    [50, 136, 189]
].reverse();

const LIGHT_SETTINGS = {
    lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
    ambientRatio: 0.4,
    diffuseRatio: 0.6,
    specularRatio: 0.2,
    lightsStrength: [0.8, 0.0, 0.8, 0.0],
    numberOfLights: 2
};

const elevationRange = [0, 1000];

export default class DeckGLOverlay extends Component {
    render() {
        if (!this.props.data || !this.props.timelineData) {
            return null;
        }

        const layers = [
            !this.props.settings.showHexagon ? new ScatterplotLayer({
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
            }) : null,
            this.props.settings.showHexagon ? new HexagonLayer({
                id: 'heatmap',
                data: this.props.data,
                colorRange: HEATMAP_COLORS,
                elevationRange,
                elevationScale: 5,
                extruded: true,
                getPosition: d => d.position,
                lightSettings: LIGHT_SETTINGS,
                opacity: 1,
                pickable: true,
                radius: this.props.settings.radius,
                coverage: this.props.settings.coverage,
                upperPercentile: this.props.settings.upperPercentile,
                onHover: hover => this.props.onHover(hover)
            }) : null,
            new PathLayer({
                id: 'timeline-layer',
                data: this.props.timelineData,
                opacity: 1,
                pickable: true,
                widthScale: 20,
                widthMinPixels: 2,
                getPath: d => d.path,
                getColor: d => d.color,
                getWidth: () => 5,
                onHover: hover => this.props.onHover(hover)
            })
        ];

        return (
            <DeckGL {...this.props.viewport} layers={layers} onWebGLInitialized={this._initialize}/>
        );
    }
}
