import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LocationDataManager from './components/LocationDataManager';
import MicroscopyManager from './components/MicroscopyManager';
import LocationView from './components/LocationView';
import MarkerDataManager from './components/MarkerDataManager';
import CultureMediaManager from './components/CultureMediaManager';
//import AddSample from './components/AddSample';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import SequencingDataForm from './components/SequencingDataForm';
import SampleDataManager from './components/SampleDataManager';


function App() {
    return (
        <Router>
            <NavBar />
            <div className="ui container" style={{ marginTop: '5em' }}>
                <Routes>
                    <Route path='/' element={<Dashboard />} />
                    <Route path='/location-data-manager' element={<LocationDataManager />} />
                    <Route path='/view-location-data' element={<LocationView />} />
                    <Route path='/microscopy-data-manager' element={<MicroscopyManager />} />
                    <Route path='/define-markers' element={<MarkerDataManager />} />
                    <Route path='/define-media' element={<CultureMediaManager />} />
                    <Route path='/add-sequence-entry' element={<SequencingDataForm />} />
                    <Route path='/sample-data-manager' element={<SampleDataManager />} />
                    
                    {/* Add other routes here */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
