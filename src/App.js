import React, {Component} from 'react';
import styled, {injectGlobal} from 'styled-components'
import MapGL, {FlyToInterpolator, Marker} from 'react-map-gl';
import timelineData from './data/timeline'
import pointData from './data/points'
import DeckGLOverlay from './DeckGLOverlay';
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
                longitude: 100.534131,
                latitude: 13.758490,
                zoom: 11,
                pitch: 30,
                maxZoom: 16
            },
            timelinePoints: [],
            status: 'LOADING',
            x: 0,
            y: 0,
            hoveredObject: null,
            // popupInfo: {},
            selectedPoint: {}
        };
    }

    componentDidMount () {
        this._processTimelineData();
        window.addEventListener('resize', this._resize);
        this._resize();
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this._resize);
    }

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

    _onHover = ({x, y, object}) => {
        // this.setState({x, y, hoveredObject: object});
    };

    // _onPointClick = (popupInfo) => {
    //     console.log(popupInfo);
    //     this.setState({popupInfo});
    // };

    _goToViewport = ({longitude, latitude, name}) => {
        this._onViewportChange({
            longitude,
            latitude,
            zoom: 15,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 1000
        });
        this.setState({
            selectedPoint: {longitude, latitude, name}
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

                <PointControl pointData={pointData} onViewportChange={this._goToViewport}/>

                <MapGL
                    {...this.state.viewport}
                    onViewportChange={viewport => this._onViewportChange(viewport)}
                    mapStyle={MAPBOX_STYLE}
                    mapboxApiAccessToken={MAPBOX_TOKEN}>
                    <DeckGLOverlay
                        viewport={this.state.viewport}
                        timelineData={timelineData}
                        pointData={pointData}
                        settings={this.state.settings}
                        onHover={hover => this._onHover(hover)}
                        // onPointClick={this._onPointClick}
                    />

                    {Object.keys(this.state.selectedPoint).length &&
                    <StyledMarker latitude={this.state.selectedPoint.latitude} longitude={this.state.selectedPoint.longitude}>
                        {this.state.selectedPoint.name}
                    </StyledMarker>
                    }
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

const StyledMarker = styled(Marker)`
  color: #fff;
`;

export default App;
