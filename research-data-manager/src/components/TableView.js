import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // or any other theme of your choice
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import 'semantic-ui-css/semantic.min.css';

// ImageThumbnail component to handle the rendering and click action
const ImageThumbnail = ({ url, onOpen }) => (
  <img
    src={url}
    alt=""
    style={{ maxWidth: '50px', maxHeight: '50px', cursor: 'pointer', margin: '2px' }}
    onClick={onOpen}
  />
);

// Assuming actionCellRenderer is a functional component for React, we need to define it properly.
const ActionCellRenderer = ({ data }) => {
  const onEditClick = () => {
    // Edit logic here
    console.log(`Edit location with ID: ${data.location_id}`);
  };

  const onDeleteClick = () => {
    // Delete logic here
    console.log(`Delete location with ID: ${data.location_id}`);
  };

  return (
    <div>
      <button className="ui primary small button" onClick={onEditClick}>
        <i className="edit icon"></i>Edit
      </button>
      <button className="ui red small button" onClick={onDeleteClick}>
        <i className="delete icon"></i>Delete
      </button>
    </div>
  );
};

const TableView = ({ rowData, columnDefs, onSelectionChanged, onFilterChanged   }) => {
  const [gridApi, setGridApi] = useState(null);
  //const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  //const [currentImage, setCurrentImage] = useState('');
  // Lightbox state handling
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imageList, setImageList] = useState([]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
    // Instead of 'autoHeight', we'll manually adjust the row heights
    updateRowHeight(params.api);
  };

  const onExportClick = () => {
    const selectedRows = gridApi.getSelectedRows();
    gridApi.exportDataAsCsv({ onlySelected: true, onlySelectedAllPages: true });
  };
  



  // This function will adjust row heights based on the image cell content
  const updateRowHeight = (gridApi) => {
    gridApi.forEachNode(function (rowNode) {
      if (rowNode.data) {
        // Assuming each image is 50x50 plus some margin, adjust as needed
        const numberOfImages = Array.isArray(rowNode.data.imageField) ? rowNode.data.imageField.length : 0;
        const numberOfRows = Math.ceil(numberOfImages / 4); // Adjust the number per row as needed
        const newHeight = numberOfRows * 60; // Calculate new height
        rowNode.setRowHeight(newHeight);
      }
    });
    gridApi.onRowHeightChanged();
  };

  const onSelectionChangedCallback = () => {
    // Get selected rows and pass them to the callback provided by the parent component
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    onSelectionChanged(selectedData);
  };

   // Add a new callback for filter changes
   const onGridFilterChanged = () => {
    // Get all the filtered nodes
    const filteredNodes = gridApi.getModel().rootNode.childrenAfterFilter;
    // Extract the data from the nodes
    const filteredData = filteredNodes.map(node => node.data);
    // Pass the filtered data to the callback provided by the parent component
    onFilterChanged(filteredData);
  };

  // Function to handle the opening of the lightbox
  const handleImageClick = (imageArray, index) => {
    setImageList(imageArray); // Set the array of images
    setPhotoIndex(index); // Set the index of the image that was clicked
    setIsOpen(true); // Open the lightbox
  };

  // Custom cell renderer component for images
  const ImageCellRenderer = ({ value }) => {
    const maxThumbnails = 2; // Limit the number of thumbnails
    const imagesToDisplay = value.slice(0, maxThumbnails);
    const moreImagesCount = value.length - maxThumbnails;

    return (
      <>
        {imagesToDisplay.map((url, index) => (
          <ImageThumbnail key={index} url={url} onOpen={() => handleImageClick(value, index)} />
        ))}
        {moreImagesCount > 0 && (
          <span onClick={() => handleImageClick(value, 0)} style={{ cursor: 'pointer' }}>
            +{moreImagesCount} more
          </span>
        )}
      </>
    );
  };

  const updatedColumnDefs = columnDefs.map(col => {
    if (col.field === 'imageField') {
      return { ...col, cellRendererFramework: ImageCellRenderer };
    }
    // Ensure the action column is not altered by the map operation
    return col;
  });
  
  // Add action column definition if it's not already present
  const actionColumn = {
    headerName: 'Actions',
    field: 'actions',
    cellRendererFramework: ActionCellRenderer,
    minWidth: 250,
    width: 250,
    suppressSizeToFit: true,
    sortable: false,
  };
  
  // Ensure the action column is included
  if (!updatedColumnDefs.some(col => col.field === 'actions')) {
    updatedColumnDefs.push(actionColumn);
  }







  return (
    <div
      className="ag-theme-alpine"
      style={{ height: '100%', width: '100%' }}
    >
      <button className="ui primary small button" style={{margin:'5px'}} onClick={onExportClick}>Export to CSV</button>
      <AgGridReact
        defaultColDef={{
          resizable: true,
          minWidth: 100,
          filter: true,
          floatingFilter: true, // Enable floating filters
          sortable: true,
        }}
        frameworkComponents={{ // Correct usage for React components
          imageCellRenderer: ImageCellRenderer,
          actionCellRenderer: ActionCellRenderer, // Assuming ActionCellRenderer is a React component
        }}
        columnDefs={updatedColumnDefs}
        rowData={rowData}
        rowSelection="multiple"
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChangedCallback}
        onFilterChanged={onGridFilterChanged}
        pagination={true}
        paginationPageSize={10}
        domLayout="autoHeight"
        animateRows={true}
      />

      {isOpen && imageList.length > 0 && (
        <Lightbox
          mainSrc={imageList[photoIndex]}
          nextSrc={imageList[(photoIndex + 1) % imageList.length]}
          prevSrc={imageList[(photoIndex + imageList.length - 1) % imageList.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + imageList.length - 1) % imageList.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % imageList.length)
          }
        />
      )}

    </div>
  );
};

export default TableView;