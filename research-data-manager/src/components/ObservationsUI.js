import React, { useState, useEffect } from 'react';
import { Button, Input, List, Form, TextArea, Segment, Image, Grid, Label } from 'semantic-ui-react';
import data from '../schemas/mic.json';

const ObservationsUI = () => {
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [observations, setObservations] = useState({});
    const [selectedObservation, setSelectedObservation] = useState(null);
    const [parameters, setParameters] = useState({});
    const [selectedParameter, setSelectedParameter] = useState(null);

    const [typeInput, setTypeInput] = useState('');
    const [observationInput, setObservationInput] = useState('');
    const [parameterInput, setParameterInput] = useState('');
    const [descriptionInput, setDescriptionInput] = useState('');

    const [parameterImages, setParameterImages] = useState({}); // New state variable for images
    const [imageInput, setImageInput] = useState(''); // State for image input (URL or file data)
    const [imageDescriptionInput, setImageDescriptionInput] = useState(''); // State for image description
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const [typeDescription, setTypeDescription] = useState('');
    const [observationDescription, setObservationDescription] = useState('');
    const [parameterDescription, setParameterDescription] = useState('');


    useEffect(() => {
        //fetch schema data from server
        const fetchSchemaData = async () => {
            try {
                
                const response = await fetch('/api/microscopy/load-schema');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                
                const loadedTypes = data.map(item => item.type);
                const loadedObservations = {};
                const loadedParameters = {};
                const loadedImages = {};

                data.forEach(typeItem => {
                    loadedObservations[typeItem.type] = typeItem.observations.map(obsItem => obsItem.observation);

                    typeItem.observations.forEach(obsItem => {
                        if (obsItem.parameters) {
                            loadedParameters[obsItem.observation] = obsItem.parameters.map(paramItem => {
                                const { name, description } = paramItem;
                                if (paramItem.images) {
                                    loadedImages[name] = paramItem.images.map(imageItem => ({
                                        src: imageItem.src,
                                        description: imageItem.description,
                                        file: imageItem.file 
                                    }));
                                }
                                return { name, description };
                            });
                        }
                    });
                });

                setTypes(loadedTypes);
                setObservations(loadedObservations);
                setParameters(loadedParameters);
                setParameterImages(loadedImages);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        // Call the fetch function
        fetchSchemaData();
    }, []);




    const handleAddType = () => {
        if (typeInput) {
            setTypes([...types, typeInput]);
            setTypeInput('');

        }
    };

    const handleAddObservation = () => {
        if (observationInput && selectedType) {
            const newObservations = { ...observations, [selectedType]: [...(observations[selectedType] || []), observationInput] };
            setObservations(newObservations);
            setObservationInput('');
        }
    };

    const handleAddParameter = () => {
        if (parameterInput && selectedObservation) {
            const newParameters = { ...parameters, [selectedObservation]: [...(parameters[selectedObservation] || []), { name: parameterInput, description: descriptionInput }] };
            setParameters(newParameters);
            setParameterInput('');
            setDescriptionInput('');
        }
    };



    const handleFileChange = (e) => {
        if (!selectedParameter) {
            // Handle error: No parameter selected
            return;
        }

        const file = e.target.files[0];
        if (!file) {
            // Handle error: No file selected or user cancelled the file dialog
            return;
        }

        // Store the file for adding later
        setImageInput(file);
    };

    const handleAddImageToParameter = () => {
        if (!imageInput || !selectedParameter) {
            // Handle error: No image selected or no parameter selected
            return;
        }

        const newImageDescription = {
            src: URL.createObjectURL(imageInput), // Create a URL for preview
            file: imageInput,
            description: imageDescriptionInput,
        };

        // Add the new image description to the images for the selected parameter
        setParameterImages({
            ...parameterImages,
            [selectedParameter.name]: [
                ...(parameterImages[selectedParameter.name] || []),
                newImageDescription
            ],
        });

        // Reset the file input by changing the key, which forces a re-render of the input
        setFileInputKey(Date.now());

        // Clear the stored file and description input
        setImageInput('');
        setImageDescriptionInput('');
    };

    const handleSelectType = (type) => {
        setSelectedType(type);
        const firstObservation = observations[type]?.[0];
        setSelectedObservation(firstObservation);

        if (firstObservation) {
            const firstParameter = parameters[firstObservation]?.[0];
            setSelectedParameter(firstParameter);
        } else {
            setSelectedParameter(null);
        }
    };


    const handleSelectObservation = (observation) => {
        setSelectedObservation(observation);
        const firstParameter = parameters[observation]?.[0];
        setSelectedParameter(firstParameter);
    };



    const handleDeleteImageFromParameter = (parameterName, imageToDelete) => {
        // Check if the selectedParameter and its images exist
        if (selectedParameter && parameterImages[parameterName]) {
            // Filter out the image to delete
            const updatedImages = parameterImages[parameterName].filter(
                image => image.src !== imageToDelete.src
            );

            // Update the state with the filtered images
            setParameterImages({
                ...parameterImages,
                [parameterName]: updatedImages
            });
        }
    };


    const handleDeleteType = (typeToDelete) => {
        setTypes(types.filter(type => type !== typeToDelete));

        // Remove associated observations and parameters
        const newObservations = { ...observations };
        delete newObservations[typeToDelete];
        setObservations(newObservations);

        // Remove associated parameters
        const newParameters = { ...parameters };
        observations[typeToDelete]?.forEach(observation => {
            delete newParameters[observation];
        });
        setParameters(newParameters);

        // Reset selections if the current selections are part of the deleted type
        if (selectedType === typeToDelete) {
            setSelectedType(null);
            setSelectedObservation(null);
            setSelectedParameter(null);
        }
    };


    const handleDeleteObservation = (observationToDelete) => {
        const newObservations = { ...observations };
        newObservations[selectedType] = newObservations[selectedType].filter(observation => observation !== observationToDelete);
        setObservations(newObservations);

        // Remove associated parameters
        const newParameters = { ...parameters };
        delete newParameters[observationToDelete];
        setParameters(newParameters);

        // Reset selection if the current selection is the deleted observation
        if (selectedObservation === observationToDelete) {
            setSelectedObservation(null);
            setSelectedParameter(null);
        }
    };


    const handleDeleteParameter = (parameterToDelete) => {
        const newParameters = { ...parameters };
        newParameters[selectedObservation] = newParameters[selectedObservation].filter(parameter => parameter !== parameterToDelete);
        setParameters(newParameters);

        // Remove associated images
        const newImages = { ...parameterImages };
        delete newImages[parameterToDelete.name];
        setParameterImages(newImages);

        // Reset selection if the current selection is the deleted parameter
        if (selectedParameter === parameterToDelete) {
            setSelectedParameter(null);
        }
    };


    const handleSubmitToServer = () => {
        // Construct the structuredData within this function
        const structuredData = types.map(type => ({
            type: type,
            observations: observations[type]?.map(observation => ({
                observation: observation,
                parameters: parameters[observation]?.map((parameter, paramIndex) => {
                    const imageEntries = parameterImages[parameter.name] || [];
                    return {
                        ...parameter,
                        images: imageEntries.map((image, imageIndex) => ({
                            imageNumber: `${type}-${observation}-${parameter.name}-${imageIndex + 1}`,
                            description: image.description,
                            file: image.file // This is the file reference, to be used in the actual file upload
                        }))
                    };
                }) || [] // Ensure this is always an array
            })) || [] // Ensure this is always an array
        }));

        // Create a FormData object and append files and the JSON data
        const formData = new FormData();

        // Append schema data
        formData.append('schema', JSON.stringify(structuredData));

        // Append images
        structuredData.forEach(typeItem => {
            typeItem.observations.forEach(obsItem => {
                obsItem.parameters.forEach(paramItem => {
                    paramItem.images.forEach((image, index) => {
                        formData.append(
                            `images/${typeItem.type}/${obsItem.observation}/${paramItem.name}/${index}`,
                            image.file
                        );
                    });
                });
            });
        });

        // Send the form data to the server
        fetch('/api/microscopy/save-schema', {
            method: 'POST',
            body: formData,
        }).then(response => {
            // Handle response
        }).catch(error => {
            // Handle error
        });
    };




    // Implement the delete handlers similarly

    return (
        <Segment>
            <Form>
                <Grid>
                    <Grid.Row columns={2}>
                        {/* Type Input */}
                        <Grid.Column><Label>Input observation types</Label></Grid.Column>
                        <Grid.Column></Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={3}>
                        {/* Type Input */}
                        <Grid.Column>
                            <Form.Field>
                                <Input
                                    action={{ icon: 'add', onClick: handleAddType }}
                                    placeholder="Add type..."
                                    value={typeInput}
                                    onChange={(e) => setTypeInput(e.target.value)}
                                />
                                <TextArea
                                    placeholder="Type description..."
                                    value={typeDescription}
                                    onChange={(e) => setTypeDescription(e.target.value)}
                                />
                            </Form.Field>
                        </Grid.Column>
                        {/* Type List */}
                        <Grid.Column>
                            <List selection>
                                {types.map((type, index) => (
                                    <List.Item key={index} onClick={() => handleSelectType(type)} active={type === selectedType}>
                                        <List.Content floated='left'>{type}</List.Content>
                                        <List.Content floated='right'><Button icon="delete" onClick={() => handleDeleteType(type)} /></List.Content>

                                    </List.Item>
                                ))}
                            </List>
                        </Grid.Column>
                        <Grid.Column>
                            <Label>
                                { }
                            </Label>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        {/* Type Input */}
                        <Grid.Column><label>Input observations for {selectedType}</label></Grid.Column>
                        <Grid.Column></Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={3}>
                        {/* Type Input */}
                        <Grid.Column>

                            <Form.Field>
                                <Input
                                    action={{ icon: 'add', onClick: handleAddObservation }}
                                    placeholder="Add observation name..."
                                    value={observationInput}
                                    onChange={(e) => setObservationInput(e.target.value)}
                                />
                                <TextArea
                                    placeholder="Observation description..."
                                    value={observationDescription}
                                    onChange={(e) => setObservationDescription(e.target.value)}
                                />
                            </Form.Field>
                        </Grid.Column>

                        {/* Type List */}
                        <Grid.Column>
                            <List selection>
                                {selectedType && observations[selectedType]?.map((observation, index) => (
                                    <List.Item key={index} onClick={() => handleSelectObservation(observation)} active={observation === selectedObservation} >
                                        <List.Content floated='left'>{observation}</List.Content>
                                        <List.Content floated='right'><Button icon="delete" onClick={() => handleDeleteObservation(observation)} /></List.Content>

                                    </List.Item>
                                ))}
                            </List>
                        </Grid.Column>
                        <Grid.Column>
                            <Label>
                                { }
                            </Label>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        {/* Type Input */}
                        <Grid.Column><Label>Input parameters for {selectedObservation}</Label></Grid.Column>
                        <Grid.Column></Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={3}>
                        {/* Type Input */}

                        <Grid.Column>

                            <Form.Field>

                                <Input
                                    action={{ icon: 'add', onClick: handleAddParameter }}
                                    placeholder="Add parameter..."
                                    value={parameterInput}
                                    onChange={(e) => setParameterInput(e.target.value)}
                                />
                                <TextArea
                                    placeholder="Parameter description..."
                                    value={parameterDescription}
                                    onChange={(e) => setParameterDescription(e.target.value)}
                                />
                            </Form.Field>
                        </Grid.Column>

                        {/* Type List */}
                        <Grid.Column>

                            <List selection>
                                {selectedObservation && parameters[selectedObservation]?.map((param, index) => (
                                    <List.Item key={index} onClick={() => setSelectedParameter(param)} active={param === selectedParameter}>
                                        <List.Content floated='left'>{param.name}</List.Content>
                                        <List.Content floated='right'><Button icon="delete" onClick={() => handleDeleteParameter(param)} /></List.Content>

                                    </List.Item>
                                ))}
                            </List>
                        </Grid.Column>
                    </Grid.Row>

                    {/* Assuming a parameter is selected */}
                    {
                        selectedParameter && (
                            <Grid.Row columns={2}>

                                <Grid.Column>
                                    <Input type="file" key={fileInputKey} onChange={handleFileChange} />
                                    <TextArea
                                        placeholder="Enter image description..."
                                        value={imageDescriptionInput}
                                        onChange={(e) => setImageDescriptionInput(e.target.value)}
                                    />
                                    <Button content="Add Image" onClick={handleAddImageToParameter} />
                                </Grid.Column>
                                <Grid.Column>
                                    <List selection divided verticalAlign='middle'>
                                        {parameterImages[selectedParameter.name]?.map((image, index) => (
                                            <List.Item key={index}>
                                                <img src={image.src} alt={image.description} style={{ width: '100px', height: 'auto' }} />
                                                <List.Content>
                                                    <List.Header>{image.description}</List.Header>
                                                </List.Content>
                                                <List.Content floated='right'>
                                                    <Button icon="delete" onClick={() => handleDeleteImageFromParameter(selectedParameter.name, image)} />
                                                </List.Content>
                                            </List.Item>
                                        ))}
                                    </List>
                                </Grid.Column>
                            </Grid.Row>
                        )
                    }


                </Grid>
                <Button onClick={handleSubmitToServer} primary>Submit to Server</Button>
            </Form>
        </Segment>

    );
};

export default ObservationsUI;
