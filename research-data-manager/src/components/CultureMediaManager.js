import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form as SemanticForm, Button, Input, Loader, Modal, Table } from 'semantic-ui-react';

const CultureMediaManager = () => {
    const [mediaID, setMediaID] = useState('');
    const [mediaName, setMediaName] = useState('');
    const [composition, setComposition] = useState('');
    const [cultureMedia, setCultureMedia] = useState([]); // State for culture media list
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isEditing, setIsEditing] = useState(false); // State to track editing mode

    useEffect(() => {
        // Placeholder data, replace with actual API call
        const placeholderCultureMedia = [
            { mediaID: 'C001', mediaName: 'Media 1', composition: 'Composition 1' },
            { mediaID: 'C002', mediaName: 'Media 2', composition: 'Composition 2' },
            // More placeholder data if needed
        ];
        setCultureMedia(placeholderCultureMedia);
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        const formData = {
            mediaID,
            mediaName,
            composition
        };

        try {
            let response;
            if (isEditing) {
                response = await axios.put(`/api/culture-media/${mediaID}`, formData); // Update for editing
            } else {
                response = await axios.post('/api/culture-media', formData); // Post for new addition
            }

            console.log('Form submission response:', response.data);
            setModalContent(`Success! Culture media data ${isEditing ? 'updated' : 'added'} successfully.`);
            setModalOpen(true);
            // Refresh culture media list after submission
        } catch (error) {
            console.error('Error submitting form:', error);
            setModalContent('Error! There was a problem submitting the form.');
            setModalOpen(true);
        } finally {
            setLoading(false);
            setIsEditing(false);
            setMediaID('');
            setMediaName('');
            setComposition('');
        }
    };

    const handleEdit = (media) => {
        setMediaID(media.mediaID);
        setMediaName(media.mediaName);
        setComposition(media.composition);
        setIsEditing(true);
    };

    const handleDelete = async (mediaID) => {
        setLoading(true);
        try {
            await axios.delete(`/api/culture-media/${mediaID}`);
            // Remove culture media from state
            setCultureMedia(cultureMedia.filter(media => media.mediaID !== mediaID));
            setModalContent('Culture media deleted successfully.');
            setModalOpen(true);
        } catch (error) {
            console.error('Error deleting culture media:', error);
            setModalContent('Error! There was a problem deleting the culture media.');
            setModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setIsEditing(false);
        setMediaID('');
        setMediaName('');
        setComposition('');
    };

    const renderTableHeader = () => (
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Media ID</Table.HeaderCell>
                <Table.HeaderCell>Media Name</Table.HeaderCell>
                <Table.HeaderCell>Composition</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
    );

    const renderTableRows = () => (
        cultureMedia.map(media => (
            <Table.Row key={media.mediaID}>
                <Table.Cell>{media.mediaID}</Table.Cell>
                <Table.Cell>{media.mediaName}</Table.Cell>
                <Table.Cell>{media.composition}</Table.Cell>
                <Table.Cell>
                    <Button onClick={() => handleEdit(media)}>Edit</Button>
                    <Button onClick={() => handleDelete(media.mediaID)}>Delete</Button>
                </Table.Cell>
            </Table.Row>
        ))
    );

    return (
        <div>
            <h1>{isEditing ? 'Edit Culture Media Details' : 'Add Culture Media Details'}</h1>
            <SemanticForm onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <SemanticForm.Field>
                    <label>Media ID</label>
                    <Input
                        placeholder='Enter Media ID'
                        value={mediaID}
                        onChange={(e) => setMediaID(e.target.value)}
                    />
                </SemanticForm.Field>
                <SemanticForm.Field>
                    <label>Media Name</label>
                    <Input
                        placeholder='Enter Media Name'
                        value={mediaName}
                        onChange={(e) => setMediaName(e.target.value)}
                    />
                </SemanticForm.Field>
                <SemanticForm.Field>
                    <label>Composition</label>
                    <Input
                        placeholder='Enter Composition'
                        value={composition}
                        onChange={(e) => setComposition(e.target.value)}
                    />
                </SemanticForm.Field>

                <Button type='submit' disabled={loading}>
                    {loading ? <Loader active inline='centered' /> : 'Submit'}
                </Button>
            </SemanticForm>

            <Modal
                open={modalOpen}
                onClose={closeModal}
                dimmer="blurring"
                size="mini"
            >
                <Modal.Content>
                    <p>{modalContent}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={closeModal}>Close</Button>
                </Modal.Actions>
            </Modal>

            <h2>Existing Culture Media</h2>
            <Table celled>
                {renderTableHeader()}
                <Table.Body>
                    {renderTableRows()}
                </Table.Body>
            </Table>
        </div>
    );
};

export default CultureMediaManager;
