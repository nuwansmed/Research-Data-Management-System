import React from 'react';
import CardWithDropdown from './CardWithDropdown'; // Import the CardWithDropdown component

const Dashboard = () => {
    // Set the page name
    const pageName = "Dashboard";

    const locationCardOptions = [
        {
            key: 'add',
            text: 'Add new location or visit',
            value: '/location-data-manager',
        },
        {
            key: 'view',
            text: 'View/Edit location data',
            value: '/view-location-data',
        },
        // Add more options as needed
    ];
    const sampleCardOptions = [
        {
            key: 'add',
            text: 'Add new sample',
            value: '/sample-data-manager',
        },
        {
            key: 'view',
            text: 'View/Edit sample data',
            value: '/microscopy-data-manager',
        },
        // Add more options as needed
    ];
    const cultureCardOptions = [
        {
            key: 'add',
            text: 'Add new culture',
            value: '/sample-data-manager',
        },
        {
            key: 'view',
            text: 'View/Edit culture data',
            value: '/sample-data-manager',
        },
        {
            key: 'media',
            text: 'Add/Edit culture media',
            value: '/define-media',
        },
        {
            key: 'calibrate',
            text: 'Calibrate culture capture viewport',
            value: '/microscopy-data-manager',
        },
        // Add more options as needed
    ];
    const microscopyCardOptions = [
        {
            key: 'add',
            text: 'Add new specimen',
            value: '/sample-data-manager',
        },
        {
            key: 'view',
            text: 'View/Edit microscopy data',
            value: '/sample-data-manager',
        },
        {
            key: 'schema',
            text: 'Edit microscopy schema',
            value: '/microscopy-data-manager',
        },
        // Add more options as needed
    ];
    const assayCardOptions = [
        {
            key: 'add',
            text: 'Add new assay',
            value: '/sample-data-manager',
        },
        {
            key: 'view',
            text: 'View/Edit assay data',
            value: '/microscopy-data-manager',
        },
        // Add more options as needed
    ];
    const sequencingCardOptions = [
        {
            key: 'add',
            text: 'Add new entry',
            value: '/add-sequence-entry',
        },
        {
            key: 'add_marker',
            text: 'Define markers',
            value: '/define-markers',
        },
        {
            key: 'view',
            text: 'View/Edit sequence entries',
            value: '/microscopy-data-manager',
        },
        // Add more options as needed
    ];

    return (
        <div className='ui container'>
            <h2 className='ui header'>{pageName}</h2>
            <h3 className='ui dividing header'>Data Entry Modules</h3>
            <div className='ui three stackable cards'>
                {/* Sampling Location Manager Card */}
                <CardWithDropdown
                    header="Location Data Manager"
                    description="Manage and track sampling locations."
                    dropdownOptions={locationCardOptions}
                />
                <CardWithDropdown
                    header="Sample Data Manager"
                    description="Manage and track sample data."
                    dropdownOptions={sampleCardOptions}
                />
                <CardWithDropdown
                    header="Culture Data Manager"
                    description="Manage and track culture data."
                    dropdownOptions={cultureCardOptions}
                />
                <CardWithDropdown
                    header="Microscopy Data Manager"
                    description="Manage and track microscopy data."
                    dropdownOptions={microscopyCardOptions}
                />
                <CardWithDropdown
                    header="BioAssay Data Manager"
                    description="Manage and track Bioassay data."
                    dropdownOptions={assayCardOptions}
                />
                <CardWithDropdown
                    header="Sequencing Data Manager"
                    description="Manage sequencing data."
                    dropdownOptions={sequencingCardOptions}
                />
                {/* Other cards follow similar structure */}
            </div>
            <h3 className='ui dividing header'>Tools</h3>
            {/* ... rest of your component ... */}
        </div>
    );
};

export default Dashboard;
