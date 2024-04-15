import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form as SemanticForm, Checkbox, Button, Input, Select, Loader, Modal } from 'semantic-ui-react';
import Form from '@rjsf/core';
import { UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

const SampleForm = ({ mode, initialValues }) => {
    const [formData, setFormData] = useState(initialValues);

    // Add your form state variables and hooks here

    const handleSubmit = () => {
        // Add your form submission logic here
    };

    return (
        <div>
            <h1>Add new sample :</h1>
            <SemanticForm onSubmit={(e) => {
                e.preventDefault(); // Prevent the default form submit action
                handleSubmit(); // Call handleSubmit to log all data
            }}>
                
                <SemanticForm.Group widths='equal'>
                    
                        
                        <SemanticForm.Field>
                            <label>Select Visit Date</label>
                            <Select
                                placeholder='Select Location ID'
                                //options={locationOptions}
                                //value={locationID}
                                //onChange={(e, { value }) => setLocationID(value)}
                            />
                        </SemanticForm.Field>
                    
                       
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
                    


                    <SemanticForm.Field>
                        <label>Visit Date</label>
                        <Input
                            type='date'
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                        />
                    </SemanticForm.Field>
                </SemanticForm.Group>
                

                {isLoadingSchema ? (
                    <div>Loading Schema...</div>
                ) : dynamicSchema ? (
                    // Render form only if dynamicSchema is loaded
                    <Form
                        //schema={dynamicSchema}
                        //uiSchema={uiSchema}
                        //formData={dynamicFormData}
                        //onChange={({ formData }) => setDynamicFormData(formData)}
                        validator={validator}
                        widgets={{
                            FileWidget: (props) => (
                                <input
                                    type="file"
                                    multiple
                                    //onChange={(e) => handleFileChange(props.id, e.target.files)}
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
                //open={modalOpen}
                //onClose={closeModal}
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

export default SampleForm;
