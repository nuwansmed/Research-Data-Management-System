import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form as SemanticForm, Checkbox, Button, Input, Select, Loader, Modal } from 'semantic-ui-react';
import Form from '@rjsf/core';
import { UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

const SampleDataManager = () => {
    const [isPreviousCulture, setIsPreviousCulture] = useState(false);
    const [sampleId, setSampleId] = useState('');
    const [locationId, setLocationId] = useState('');
    const [date, setDate] = useState('');
    const [locationOptions, setLocationOptions] = useState([]);
    const [dynamicFormData, setDynamicFormData] = useState({});
    const [isLoadingSchema, setIsLoadingSchema] = useState(true);
    const [dynamicSchema, setDynamicSchema] = useState(null);

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
        const fetchSchema = async () => {
            setIsLoadingSchema(true);
            try {
                const schemaResponse = await axios.get('/assets/schema/LocationDataManager.json');
                setDynamicSchema(schemaResponse.data);
            } catch (error) {
                console.error('Error fetching dynamic schema:', error);
            } finally {
                setIsLoadingSchema(false);
            }
        };
        fetchSchema();
    }, []);

    useEffect(() => {
        const fetchLocationIDs = async () => {
            try {
                const response = await axios.get('/api/locations/ids');
                setLocationOptions(response.data.map(id => ({ key: id, text: id, value: id })));
            } catch (error) {
                console.error('Error fetching location IDs:', error);
            }
        };
        fetchLocationIDs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            isPreviousCulture,
            sampleId,
            locationId,
            date,
            dynamicFormData,
        };
        console.log('Form data:', formData);
        // Submit logic here
    };

    return (
        <div>
            <h1>Sample Data Manager</h1>
            <SemanticForm onSubmit={handleSubmit}>
                <Checkbox
                    label='Is Previously Available Culture'
                    checked={isPreviousCulture}
                    onChange={(e, { checked }) => setIsPreviousCulture(checked)}
                />
                <br /><br />

                {isPreviousCulture ? (
                    <SemanticForm.Field>
                        <label>Select Sample ID</label>
                        <Select
                            placeholder='Select Sample ID'
                            options={locationOptions}
                            value={sampleId}
                            onChange={(e, { value }) => setSampleId(value)}
                        />
                    </SemanticForm.Field>
                ) : (
                    <>
                        <SemanticForm.Field>
                            <label>Enter Sample ID</label>
                            <Input
                                placeholder='Sample ID'
                                value={sampleId}
                                onChange={(e) => setSampleId(e.target.value)}
                            />
                        </SemanticForm.Field>
                        <SemanticForm.Field>
                            <label>Select Location ID</label>
                            <Select
                                placeholder='Select Location ID'
                                options={locationOptions}
                                value={locationId}
                                onChange={(e, { value }) => setLocationId(value)}
                            />
                        </SemanticForm.Field>
                        <SemanticForm.Field>
                            <label>Select Date</label>
                            <Input
                                type='date'
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </SemanticForm.Field>
                    </>
                )}

                {isLoadingSchema ? (
                    <div>Loading Schema...</div>
                ) : dynamicSchema ? (
                    <Form
                        schema={dynamicSchema}
                        uiSchema={uiSchema}
                        formData={dynamicFormData}
                        onChange={({ formData }) => setDynamicFormData(formData)}
                        validator={validator}
                    />
                ) : (
                    <div>Error loading schema</div>
                )}

                <Button type='submit'>Submit</Button>
            </SemanticForm>
        </div>
    );
};

export default SampleDataManager;
