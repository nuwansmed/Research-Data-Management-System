import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import { Form as SemanticForm, Checkbox, Button, Input, Select, Loader, Modal } from 'semantic-ui-react';
import Form from '@rjsf/core';
import { UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
//import dynamicSchema from '../schemas/LocationDataManager.json';


/**
 * LocationDataManager component handles the management of location data.
 * It provides a form to input location details such as location ID, visit date, latitude, and longitude.
 * It also supports dynamic fields using JSON schema form.
 *
 * @component
 * @returns {JSX.Element} LocationDataManager component
 */
const LocationDataManager = () => {
    const [locationID, setLocationID] = useState('');
    const [newLocationID, setnewLocationID] = useState('');
    const [formattedLocationID, setFormattedLocationID] = useState('');
    const [locationOptions, setLocationOptions] = useState([]);
    const [isPreviousLocation, setIsPreviousLocation] = useState(false);
    const [visitDate, setVisitDate] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    //const [photos, setPhotos] = useState([]);
    const [dynamicFormData, setDynamicFormData] = useState({});
    const [fileData, setFileData] = useState({});
    const [files, setFiles] = useState({});
    const [nextLocationIndex, setNextLocationIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [dynamicSchema, setDynamicSchema] = useState(null);
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
                const timeStableSchemaResponse = await axios.get('/path/to/time-stable-schema.json');
                const timeDependentSchemaResponse = await axios.get('/path/to/time-dependent-schema.json');
                setTimeStableSchema(timeStableSchemaResponse.data);
                setTimeDependentSchema(timeDependentSchemaResponse.data);
            } catch (error) {
                console.error('Error loading schemas:', error);
                // Handle error appropriately
            }
        };

        loadSchemas();
    }, []);

    useEffect(() => {


        // Fetch location IDs from the database and populate locationOptions
        const fetchLocationIDs = async () => {
            try {
                const response = await axios.get('/api/locations/ids');
                setLocationOptions(response.data);
            } catch (error) {
                console.error('Error fetching location IDs:', error);
                // Handle error
            }
        };

        fetchLocationIDs();
    }, [triggerFetch]);

    useEffect(() => {
        // This will update the formattedLocationID whenever newLocationID or nextLocationIndex changes
        if (nextLocationIndex !== null && !isPreviousLocation) {
            setFormattedLocationID(formatLocationId(newLocationID, nextLocationIndex));
        }
    }, [newLocationID, nextLocationIndex, isPreviousLocation]);

    useEffect(() => {
        console.log('Updated fileData state:', fileData);
    }, [fileData]); // This useEffect will run whenever fileData changes

    useEffect(() => {
        getNextLocationIndex().then(index => {
            if (index !== null) {
                setNextLocationIndex(index);
                // Now that we have the index, we can format the ID immediately
                if (!isPreviousLocation) {
                    setFormattedLocationID(formatLocationId(newLocationID, index));
                }
            }
        });
    }, [isPreviousLocation]); // We added this dependency so it will re-run when isPreviousLocation changes



    useEffect(() => {
        if (dynamicSchema) {
            const identifiedFileFields = identifyFileFields(dynamicSchema);
            setFileFields(identifiedFileFields);
        }
    }, [dynamicSchema]);


    // Function to identify file upload fields in the dynamic schema
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

        // Reset the form fields to initial state
        setLocationID('');
        setnewLocationID('');
        setFormattedLocationID('');
        //setLocationOptions([]);
        setTriggerFetch(!triggerFetch); // Toggle to trigger re-fetch
        setIsPreviousLocation(false);
        setVisitDate('');
        setLatitude('');
        setLongitude('');
        //setPhotos([]);
        setDynamicFormData({});
        setFileData({});
        setFiles({});
        // Fetch the next location index and update the state
        const nextIndex = await getNextLocationIndex();
        setNextLocationIndex(nextIndex);
    };

    const handleSubmit = async () => {
        setLoading(true); // Start loading
        const finalLocationID = isPreviousLocation ? locationID : formattedLocationID;
        console.log('Submitting form with fileData:', fileData);

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
            // Reset form here if needed
        } catch (error) {
            console.error('Error submitting form:', error);
            setModalContent('Error! There was a problem submitting the form.');
            setModalOpen(true);
        } finally {
            setLoading(false); // Stop loading regardless of outcome
        }
    };


    const getNextLocationIndex = async () => {
        try {
            const response = await axios.get('/api/locations/next-index');
            return response.data.nextIndex;
        } catch (error) {
            console.error('Error fetching next location index:', error);
            // Handle error
            return null; // or some default value
        }
    };



    // We've updated formatLocationId to take the index as an argument
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
                e.preventDefault(); // Prevent the default form submit action
                handleSubmit(); // Call handleSubmit to log all data
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
                        // Render this block when isPreviousLocation is true (checked)
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
                        // Render this block when isPreviousLocation is false (not checked)
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
                ) : dynamicSchema ? (
                    // Render form only if dynamicSchema is loaded
                    <Form
                        schema={dynamicSchema}
                        uiSchema={uiSchema}
                        formData={dynamicFormData}
                        onChange={({ formData }) => setDynamicFormData(formData)}
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
                ) : (
                    <div>Error loading schema</div>
                )
                }

                <br></br>
                <Button type='submit' disabled={loading}>
                    {loading ? <Loader active inline='centered' /> : 'Submit'}
                </Button>
            </SemanticForm >
            {/* Success/Error Modal */}
            < Modal
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
            </Modal >
        </div >
    );
};

export default LocationDataManager;
