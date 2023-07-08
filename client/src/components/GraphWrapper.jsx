import React, { useEffect, useState } from 'react';
import Graph from './Graph';
import { useParams } from 'react-router-dom';

const GraphWrapper = () => {
  const { coin } = useParams();
  const [coinParam, setCoinParam] = useState(coin);

  useEffect(() => {
    setCoinParam(coin);
  }, [coin]);

  return <Graph key={coinParam} coin={coinParam} />;
};

export default GraphWrapper;
