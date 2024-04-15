import React from 'react';
import { Tab } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import ObservationsUI from './ObservationsUI';

const TabExample = () => {
  const panes = [
    {
      menuItem: 'Microscopes',
      render: () => <Tab.Pane>Microscopes Content</Tab.Pane>,
    },
    {
      menuItem: 'Observations',
      render: () => <Tab.Pane><ObservationsUI/></Tab.Pane>,
    },
  ];

  return <Tab panes={panes} />;
}

export default TabExample;
