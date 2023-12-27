import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import PointsPurchaseCard from './components/PointsPurchaseIndex.jsx';

const PointsPurchase = ({program}) => {
  return (
    <PointsPurchaseCard program={program}/>
)}

export default PointsPurchase;
