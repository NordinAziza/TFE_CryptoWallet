import React from 'react';
import Graph from './Graph';
import { useParams } from 'react-router-dom';

const GraphWrapper = () => {
  const { coin } = useParams();

  return <Graph coin={coin} />;
};

export default GraphWrapper;