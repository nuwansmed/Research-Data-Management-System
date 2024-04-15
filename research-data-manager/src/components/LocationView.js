import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './MapView';
import TableView from './TableView';
import { Button, Grid, Segment, Header } from 'semantic-ui-react';

const LocationView = () => {
  const [locations, setLocations] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [filteredLocations, setFilteredLocations] = useState([]);

  // This function will be passed to TableView and is called when the selection changes
  const handleSelectionChanged = (selectedRows) => {
    setFilteredLocations(selectedRows);
  };

  // New handler for filter changes
  const handleFilterChanged = (filteredRows) => {
    setFilteredLocations(filteredRows);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/combined-visits');
        setLocations(response.data);

        const schemaResponse = await axios.get('/assets/schema/LocationDataManager.json');
        const schema = schemaResponse.data;

        const hardcodedColumnDefs = [
          { headerName: 'Location ID', field: 'location_id', checkboxSelection: true, headerCheckboxSelection: true, pinned: 'left' },
          { headerName: 'Latitude', field: 'latitude' },
          { headerName: 'Longitude', field: 'longitude' },
          { headerName: 'Visit Date', field: 'visit_date' },
          // ...other hardcoded columns
        ];

        const isImageField = (key) => key.endsWith('Photos'); // Adjust the logic as needed

        const schemaColumnDefs = Object.keys(schema.properties).map(key => {
          const colDef = {
            headerName: schema.properties[key].title || key,
            field: key,
          };
        
          if (isImageField(key)) {
            colDef.cellRenderer = 'imageCellRenderer'; // Use the name you registered in components
          }
        
          return colDef;
        });
      
        setColumnDefs([...hardcodedColumnDefs, ...schemaColumnDefs]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleMapView = () => {
    setIsMapVisible(!isMapVisible);
  };

  return (
    <Segment padded>
      <Header as="h1">View/Edit Location Data</Header>
      <Button 
        primary 
        onClick={toggleMapView} 
        style={{ marginBottom: '1em' }}
      >
        {isMapVisible ? 'Hide Map' : 'Show Map'}
      </Button>
      
      <Grid>
        {isMapVisible && (
          <Grid.Column width={16}>
            <Segment>
              <MapView locations={filteredLocations.length > 0 ? filteredLocations : locations} />
            </Segment>
          </Grid.Column>
        )}

        <Grid.Column width={16}>
          <Segment>
            <TableView 
              rowData={locations}
              columnDefs={columnDefs}
              onSelectionChanged={handleSelectionChanged} 
              onFilterChanged={handleFilterChanged}
            />
          </Segment>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default LocationView;
