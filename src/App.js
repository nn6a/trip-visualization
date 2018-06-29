import React, { Component } from 'react';
import MapGL from 'react-map-gl';
import taxiData from './data/taxi';
import DeckGLOverlay from './DeckGLOverlay';

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
            },
            points: [],
            status: 'LOADING'
        };
    }

    componentDidMount() {
        this._processData();
        window.addEventListener('resize', this._resize);
        this._resize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    _processData = () => {
        if (taxiData) {
            this.setState({status: 'LOADED'});
            const points = taxiData.reduce((accu, curr) => {
                accu.push({
                    position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
                    pickup: true
                });
                accu.push({
                    position: [Number(curr.dropoff_longitude), Number(curr.dropoff_latitude)],
                    pickup: false
                });
                return accu;
            }, []);
            this.setState({
                points,
                status: 'READY'
            });
        }
    };

    _resize = () => {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    _onViewportChange = (viewport) => {
        this.setState({
            viewport: {...this.state.viewport, ...viewport}
        });
    };

    render() {
        return (
            <MapGL
                {...this.state.viewport}
                onViewportChange={viewport => this._onViewportChange(viewport)}
                mapStyle={MAPBOX_STYLE}
                mapboxApiAccessToken={MAPBOX_TOKEN}>
                <DeckGLOverlay
                    viewport={this.state.viewport}
                    data={this.state.points}
                />
            </MapGL>
        );
    }
}

export default App;
