import React, { Component } from 'react';
import MapGL from 'react-map-gl';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // eslint-disable-line
const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                longitude: -74,
                latitude: 40.7,
                zoom: 11,
                maxZoom: 16
            }
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize);
        this._resize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    _resize = () => {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    _onViewportChange(viewport) {
        this.setState({
            viewport: {...this.state.viewport, ...viewport}
        });
    }

    render() {
        return (
            <MapGL
                {...this.state.viewport}
                onViewportChange={viewport => this._onViewportChange(viewport)}
                mapStyle={MAPBOX_STYLE}
                mapboxApiAccessToken={MAPBOX_TOKEN}>
            </MapGL>
        );
    }
}

export default App;
