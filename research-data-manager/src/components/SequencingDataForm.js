import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Input, Dropdown, Message, Segment } from 'semantic-ui-react';

const SequencingDataForm = () => {
    const [genbankAccession, setGenbankAccession] = useState('');
    const [species, setSpecies] = useState('');
    const [isolate, setIsolate] = useState('');
    const [host, setHost] = useState('');
    const [location, setLocation] = useState('');
    const [marker, setMarker] = useState('');
    const [reference, setReference] = useState('');
    const [markersOptions, setMarkersOptions] = useState([]); // For dropdown options
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [formEnabled, setFormEnabled] = useState(false);

    // Placeholder for markers options - replace with actual data retrieval
    // This should be done when the component mounts
    useState(() => {
        const placeholderMarkers = [
            { key: 'm1', text: 'Marker 1', value: 'Marker 1' },
            { key: 'm2', text: 'Marker 2', value: 'Marker 2' },
            // ... more markers
        ];
        setMarkersOptions(placeholderMarkers);
    }, []);

    const handleRetrieveGenbank = async () => {
        setSearching(true);
        setSearchError('');
        try {
            // Placeholder logic for GenBank retrieval
            // You should replace this with a call to your backend which then queries NCBI
            const retrievedSpecies = await retrieveSpeciesFromGenbank(genbankAccession);
            setSpecies(retrievedSpecies);
            setFormEnabled(true);
        } catch (error) {
            setSearchError('Failed to retrieve data. Please try again.');
            setFormEnabled(false);
        } finally {
            setSearching(false);
        }
    };

    // Placeholder function to simulate species retrieval
    const retrieveSpeciesFromGenbank = async (accessionNumber) => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay
        return 'Homo sapiens'; // Simulate successful species retrieval
    };

    const handleSubmit = async () => {
        // Submission logic to backend
        console.log('Submit sequencing data:', {
            genbankAccession,
            species,
            isolate,
            host,
            location,
            marker,
            reference
        });
    };

    return (
        <Segment>
            <Form>
                <Form.Field>
                    <label>Genbank Accession Number</label>
                    <Input
                        action={{
                            content: 'Retrieve',
                            onClick: handleRetrieveGenbank,
                            loading: searching
                        }}
                        placeholder='Genbank Accession Number'
                        value={genbankAccession}
                        onChange={(e) => setGenbankAccession(e.target.value)}
                    />
                    {searchError && <Message negative>{searchError}</Message>}
                </Form.Field>

                {formEnabled && (
                    <>
                        <Form.Field>
                            <label>Species</label>
                            <Input
                                placeholder='Species'
                                value={species}
                                readOnly
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Isolate</label>
                            <Input
                                placeholder='Isolate'
                                value={isolate}
                                onChange={(e) => setIsolate(e.target.value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Host/Substrate</label>
                            <Input
                                placeholder='Host/Substrate'
                                value={host}
                                onChange={(e) => setHost(e.target.value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Location</label>
                            <Input
                                placeholder='Location'
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Marker</label>
                            <Dropdown
                                placeholder='Select Marker'
                                fluid
                                selection
                                options={markersOptions}
                                value={marker}
                                onChange={(e, { value }) => setMarker(value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Reference</label>
                            <Input
                                placeholder='Reference'
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                            />
                        </Form.Field>
                        <Button type='submit' onClick={handleSubmit}>Submit</Button>
                    </>
                )}
            </Form>
        </Segment>
    );
};

export default SequencingDataForm;
