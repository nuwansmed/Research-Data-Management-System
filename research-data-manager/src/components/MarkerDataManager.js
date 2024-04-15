import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form as SemanticForm, Button, Input, Loader, Modal, Table } from 'semantic-ui-react';

const MarkerDataManager = () => {
    const [markerID, setMarkerID] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [markers, setMarkers] = useState([]); // State for markers list
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isEditing, setIsEditing] = useState(false); // New state to track editing mode

    const renderTableHeader = () => (
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Marker ID</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
    );

    const renderTableRows = () => (
        markers.map(marker => (
            <Table.Row key={marker.markerID}>
                <Table.Cell>{marker.markerID}</Table.Cell>
                <Table.Cell>{marker.name}</Table.Cell>
                <Table.Cell>{marker.description}</Table.Cell>
                <Table.Cell>
                    <Button onClick={() => handleEdit(marker)}>Edit</Button>
                    <Button onClick={() => handleDelete(marker.markerID)}>Delete</Button>
                </Table.Cell>
            </Table.Row>
        ))
    );


    useEffect(() => {
        // Placeholder data, replace with actual API call
        const placeholderMarkers = [
            { markerID: 'M001', name: 'Marker 1', description: 'Description 1' },
            { markerID: 'M002', name: 'Marker 2', description: 'Description 2' },
            // Add more placeholder data as needed
        ];
        setMarkers(placeholderMarkers);
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        const formData = {
            markerID,
            name,
            description
        };

        try {
            let response;
            if (isEditing) {
                response = await axios.put(`/api/markers/${markerID}`, formData); // Update for editing
            } else {
                response = await axios.post('/api/markers', formData); // Post for new addition
            }

            console.log('Form submission response:', response.data);
            setModalContent(`Success! Marker data ${isEditing ? 'updated' : 'added'} successfully.`);
            setModalOpen(true);
            // Refresh markers list after submission
        } catch (error) {
            console.error('Error submitting form:', error);
            setModalContent('Error! There was a problem submitting the form.');
            setModalOpen(true);
        } finally {
            setLoading(false);
            setIsEditing(false);
            setMarkerID('');
            setName('');
            setDescription('');
        }
    };

    const handleEdit = (marker) => {
        setMarkerID(marker.markerID);
        setName(marker.name);
        setDescription(marker.description);
        setIsEditing(true);
    };

    const handleDelete = async (markerID) => {
        setLoading(true);
        try {
            await axios.delete(`/api/markers/${markerID}`);
            // Remove marker from state
            setMarkers(markers.filter(marker => marker.markerID !== markerID));
            setModalContent('Marker deleted successfully.');
            setModalOpen(true);
        } catch (error) {
            console.error('Error deleting marker:', error);
            setModalContent('Error! There was a problem deleting the marker.');
            setModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setMarkerID('');
        setName('');
        setDescription('');
    };

    return (
        <div>
            <h1>{isEditing ? 'Edit Marker Details' : 'Add Marker Details'}</h1>
            <SemanticForm onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <SemanticForm.Field>
                    <label>Marker ID</label>
                    <Input
                        placeholder='Enter Marker ID'
                        value={markerID}
                        onChange={(e) => setMarkerID(e.target.value)}
                    />
                </SemanticForm.Field>
                <SemanticForm.Field>
                    <label>Name</label>
                    <Input
                        placeholder='Enter Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </SemanticForm.Field>
                <SemanticForm.Field>
                    <label>Description</label>
                    <Input
                        placeholder='Enter Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </SemanticForm.Field>

                <Button type='submit' disabled={loading}>
                    {loading ? <Loader active inline='centered' /> : 'Submit'}
                </Button>
            </SemanticForm>
            {/* ... Modal and other form elements ... */}

            {/* Markers List Table */}
            <h2>Existing Markers</h2>
            <Table celled>
                {renderTableHeader()}
                <Table.Body>
                    {renderTableRows()}
                </Table.Body>
            </Table>
        </div>
    );
};

export default MarkerDataManager;
