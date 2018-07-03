import DeckGL, {ScatterplotLayer, PathLayer} from 'deck.gl';
import React, {Component} from 'react';

export default class DeckGLOverlay extends Component {
    // _initialize(gl) {
    //     gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    //     gl.blendEquation(gl.FUNC_ADD);
    // }

    render() {
        if (!this.props.timelineData) {
            return null;
        }

        const layers = [
            new PathLayer({
                id: 'timeline-layer',
                data: this.props.timelineData,
                opacity: 0.8,
                pickable: true,
                widthScale: 20,
                widthMinPixels: 2,
                getPath: d => d.path,
                getColor: d => d.color,
                getWidth: () => 1,
            }),
            new ScatterplotLayer({
                id: 'point-layer',
                data: this.props.pointData,
                pickable: true,
                opacity: 0.8,
                radiusScale: 80,
                radiusMinPixels: 0.25,
                radiusMaxPixels: 30,
                getPosition: d => [d.longitude, d.latitude, 30],
                getColor: d => [0, 128, 255],
                onHover: hover => this.props.onHover(hover),
                // onClick: d => this.props.onPointClick(d.object)
            })
        ];

        return (
            <DeckGL {...this.props.viewport} layers={layers} onWebGLInitialized={this._initialize}/>
        );
    }
}
