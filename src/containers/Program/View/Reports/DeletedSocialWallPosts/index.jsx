import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import DeletedSocialWallPostsCard from './components/DeletedSocialWallPostsIndex.jsx';

const DeletedSocialWallPosts = () => {
  return (
      <DeletedSocialWallPostsCard />
  )
}

export default DeletedSocialWallPosts;
