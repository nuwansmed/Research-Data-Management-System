import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form as SemanticForm, Checkbox, Button, Input, Select, Loader, Modal } from 'semantic-ui-react';
import Form from '@rjsf/core';
import { UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

const LocationDataManager = () => {
    const [locationID, setLocationID] = useState('');
    const [newLocationID, setnewLocationID] = useState('');
    const [formattedLocationID, setFormattedLocationID] = useState('');
    const [locationOptions, setLocationOptions] = useState([]);
    const [isPreviousLocation, setIsPreviousLocation] = useState(false);
    const [visitDate, setVisitDate] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [dynamicFormData, setDynamicFormData] = useState({});
    const [files, setFiles] = useState({});
    const [nextLocationIndex, setNextLocationIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [isLoadingSchema, setIsLoadingSchema] = useState(true);
    const [fileFields, setFileFields] = useState([]);
    const [timeStableFormData, setTimeStableFormData] = useState({});
    const [timeDependentFormData, setTimeDependentFormData] = useState({});
    const [timeStableSchema, setTimeStableSchema] = useState(null); // Schema for time-stable data
    const [timeDependentSchema, setTimeDependentSchema] = useState(null); // Schema for time-dependent data

    const uiSchema: UiSchema = {
        'ui:submitButtonOptions': {
            props: {
                disabled: true,
            },
            norender: true,
            submitText: 'Submit',
        },
    };

    useEffect(() => {
        // Asynchronously load time-stable and time-dependent schemas
        const loadSchemas = async () => {
            try {
                const timestamp = new Date().getTime();
                const timeStableSchemaResponse = await axios.get(`/assets/schema/time-stable-schema.json?t=${timestamp}`);
                const timeDependentSchemaResponse = await axios.get(`/assets/schema/time-dependent-schema.json?t=${timestamp}`);
                setTimeStableSchema(timeStableSchemaResponse.data);
                setTimeDependentSchema(timeDependentSchemaResponse.data);
            } catch (error) {
                console.error('Error loading schemas:', error);
            } finally {
                setIsLoadingSchema(false);
            }
        };

        loadSchemas();
    }, []);

    useEffect(() => {
        const fetchLocationIDs = async () => {
            try {
                const response = await axios.get('/api/locations/ids');
                setLocationOptions(response.data);
            } catch (error) {
                console.error('Error fetching location IDs:', error);
            }
        };

        fetchLocationIDs();
    }, [triggerFetch]);

    useEffect(() => {
        if (nextLocationIndex !== null && !isPreviousLocation) {
            setFormattedLocationID(formatLocationId(newLocationID, nextLocationIndex));
        }
    }, [newLocationID, nextLocationIndex, isPreviousLocation]);

    useEffect(() => {
        console.log('Updated fileData state:', files);
    }, [files]);

    useEffect(() => {
        getNextLocationIndex().then(index => {
            if (index !== null) {
                setNextLocationIndex(index);
                if (!isPreviousLocation) {
                    setFormattedLocationID(formatLocationId(newLocationID, index));
                }
            }
        });
    }, [isPreviousLocation]);

    useEffect(() => {
        if (timeStableSchema) {
            const identifiedFileFields = identifyFileFields(timeStableSchema);
            setFileFields(identifiedFileFields);
        }
    }, [timeStableSchema]);

    const identifyFileFields = (schema) => {
        const fileFields = [];
        if (schema && schema.properties) {
            Object.keys(schema.properties).forEach(key => {
                const property = schema.properties[key];
                if (property.type === 'array' && property.items && property.items.format === 'data-url') {
                    fileFields.push(key);
                }
            });
        }
        return fileFields;
    };

    const handleFileChange = (field, fileList) => {
        const newFiles = [];
        for (let i = 0; i < fileList.length; i++) {
            newFiles.push(fileList[i]);
        }
        setFiles(prevFiles => ({
            ...prevFiles,
            [field]: newFiles
        }));
    };

    const closeModal = async () => {
        setModalOpen(false);
        setLocationID('');
        setnewLocationID('');
        setFormattedLocationID('');
        setTriggerFetch(!triggerFetch);
        setIsPreviousLocation(false);
        setVisitDate('');
        setLatitude('');
        setLongitude('');
        setDynamicFormData({});
        setFiles({});
        const nextIndex = await getNextLocationIndex();
        setNextLocationIndex(nextIndex);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const finalLocationID = isPreviousLocation ? locationID : formattedLocationID;
        console.log('Submitting form with fileData:', files);

        const formData = new FormData();
        formData.append('locationID', finalLocationID);
        formData.append('isPreviousLocation', isPreviousLocation);
        formData.append('visitDate', visitDate);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);

        // Append dynamic form data excluding file fields
        const dynamicDataWithoutFiles = { ...dynamicFormData };
        fileFields.forEach(field => {
            delete dynamicDataWithoutFiles[field];
        });
        formData.append('dynamicData', JSON.stringify(dynamicDataWithoutFiles));

        // Append files to formData
        Object.keys(files).forEach(field => {
            files[field].forEach(file => {
                formData.append(field, file, file.name);
            });
        });

        // Logging formData contents for debugging
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`FormData File: ${key}: File - ${value.name}, Size: ${value.size}, Type: ${value.type}`);
            } else {
                console.log(`FormData Value: ${key}:`, value);
            }
        }

        try {
            const response = await axios.post('/api/locations', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Form submission response:', response.data);
            setModalContent('Success! Location data added successfully.');
            setModalOpen(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            setModalContent('Error! There was a problem submitting the form.');
            setModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const getNextLocationIndex = async () => {
        try {
            const response = await axios.get('/api/locations/next-index');
            return response.data.nextIndex;
        } catch (error) {
            console.error('Error fetching next location index:', error);
            return null;
        }
    };

    const formatLocationId = (input, index) => {
        const formattedInput = input.toUpperCase().replace(/\s+/g, ' ').trim().replace(/\s/g, '-');
        return `L${index}-${formattedInput}`;
    };

    const handleInputChange = (e) => {
        const validInput = e.target.value.replace(/[^a-zA-Z\s\d]/g, ''); // Keeps only letters and spaces
        setnewLocationID(validInput);
    };

    return (
        <div>
            <h1>Add new location or visit details :</h1>
            <SemanticForm onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <SemanticForm.Field>
                    <Checkbox
                        label='Is this a previously visited location?'
                        checked={isPreviousLocation}
                        onChange={(e, { checked }) => setIsPreviousLocation(checked)}
                    />
                </SemanticForm.Field>
                <SemanticForm.Group widths='equal'>
                    {isPreviousLocation ? (
                        <SemanticForm.Field>
                            <label>Select Location ID</label>
                            <Select
                                placeholder='Select Location ID'
                                options={locationOptions}
                                value={locationID}
                                onChange={(e, { value }) => setLocationID(value)}
                            />
                        </SemanticForm.Field>
                    ) : (
                        <SemanticForm.Field inline>
                            <label>Enter Location ID:</label><br></br>
                            <label>L{nextLocationIndex}-</label>
                            <Input
                                placeholder='Enter new LocationID'
                                value={newLocationID}
                                onChange={handleInputChange}
                                style={{ marginRight: '10px' }}
                            />
                            <label>{formattedLocationID}</label>
                        </SemanticForm.Field>
                    )}

                    <SemanticForm.Field>
                        <label>Visit Date</label>
                        <Input
                            type='date'
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                        />
                    </SemanticForm.Field>
                </SemanticForm.Group>
                {!isPreviousLocation && (
                    <SemanticForm.Group widths='equal'>
                        <SemanticForm.Field>
                            <label>Latitude</label>
                            <Input
                                type='number'
                                placeholder='Latitude'
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                            />
                        </SemanticForm.Field>
                        <SemanticForm.Field>
                            <label>Longitude</label>
                            <Input
                                type='number'
                                placeholder='Longitude'
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                            />
                        </SemanticForm.Field>
                    </SemanticForm.Group>
                )}

                {isLoadingSchema ? (
                    <div>Loading Schema...</div>
                ) : (
                    <>
                        {!isPreviousLocation && timeStableSchema && (
                            <Form
                                schema={timeStableSchema}
                                uiSchema={uiSchema}
                                formData={timeStableFormData}
                                onChange={({ formData }) => setTimeStableFormData(formData)}
                                validator={validator}
                                widgets={{
                                    FileWidget: (props) => (
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(e) => handleFileChange(props.id, e.target.files)}
                                        />
                                    ),
                                }}
                            />
                        )}

                        {timeDependentSchema && (
                            <Form
                                schema={timeDependentSchema}
                                uiSchema={uiSchema}
                                formData={timeDependentFormData}
                                onChange={({ formData }) => setTimeDependentFormData(formData)}
                                validator={validator}
                                widgets={{
                                    FileWidget: (props) => (
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(e) => handleFileChange(props.id, e.target.files)}
                                        />
                                    ),
                                }}
                            />
                        )}
                    </>
                )}

                <br></br>
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
        </div>
    );
};

export default LocationDataManager;
