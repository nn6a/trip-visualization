import React, {Component} from 'react';
import {injectGlobal} from 'styled-components'
import MapGL, {FlyToInterpolator} from 'react-map-gl';
import taxiData from './data/taxi';
import timelineData from './data/timeline'
import DeckGLOverlay from './DeckGLOverlay';
import {LayerControls, HEXAGON_CONTROLS} from './LayerControls';
import PointControl from './PointControl';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // eslint-disable-line
// const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';
const MAPBOX_STYLE = 'mapbox://styles/noah398/cjj0vb5140x1t2rn2p6umq4vi';

injectGlobal`
  body {
    margin: 0;
    padding: 0;
  }
`;

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                // longitude: -74,
                // latitude: 40.7,
                longitude: 100.534131,
                latitude: 13.758490,
                zoom: 11,
                pitch: 30,
                maxZoom: 16
            },
            points: [],
            timelinePoints: [],
            status: 'LOADING',
            settings: {
                ...Object.keys(HEXAGON_CONTROLS).reduce((accu, key) => ({
                    ...accu,
                    [key]: HEXAGON_CONTROLS[key].value
                }), {})
            },
            x: 0,
            y: 0,
            hoveredObject: null,
        };
    }

    componentDidMount () {
        this._processData();
        this._processTimelineData();
        window.addEventListener('resize', this._resize);
        this._resize();
    }

    componentWillUnmount () {
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

    _processTimelineData = () => {
        if (timelineData) {
            this.setState({status: 'LOADED'});
            const timelinePoints = timelineData.locations.reduce((accu, curr) => {
                // divide by 10000000 to convert E7 lat/long into normal lat/long
                accu.push([curr.longitudeE7 / 10000000, curr.latitudeE7 / 10000000]);
                return accu;
            }, []);
            this.setState({
                timelinePoints,
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

    _updateLayerSettings = (settings) => {
        this.setState({settings});
    };

    _onHover = ({x, y, object}) => {
        this.setState({x, y, hoveredObject: object});
    };

    _goToViewport = ({longitude, latitude}) => {
        this._onViewportChange({
            longitude,
            latitude,
            zoom: 11,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 3000
        });
    };

    render () {
        const timelineData = [{
            path: this.state.timelinePoints,
            name: 'timeline',
            color: [255, 0, 128]
        }];
        return (
            <div>
                {this.state.hoveredObject &&
                <div style={{
                    ...tooltipStyle,
                    transform: `translate(${this.state.x}px, ${this.state.y}px)`
                }}>
                    <div>{JSON.stringify(this.state.hoveredObject)}</div>
                </div>}

                <LayerControls
                    settings={this.state.settings}
                    propTypes={HEXAGON_CONTROLS}
                    onChange={settings => this._updateLayerSettings(settings)}/>

                <PointControl onViewportChange={this._goToViewport}/>

                <MapGL
                    {...this.state.viewport}
                    onViewportChange={viewport => this._onViewportChange(viewport)}
                    mapStyle={MAPBOX_STYLE}
                    mapboxApiAccessToken={MAPBOX_TOKEN}>
                    <DeckGLOverlay
                        viewport={this.state.viewport}
                        data={this.state.points}
                        timelineData={timelineData}
                        settings={this.state.settings}
                        onHover={hover => this._onHover(hover)}
                    />
                </MapGL>
            </div>
        );
    }
}

const tooltipStyle = {
    position: 'absolute',
    padding: '4px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    maxWidth: '300px',
    fontSize: '10px',
    zIndex: 9,
    pointerEvents: 'none'
};

export default App;
