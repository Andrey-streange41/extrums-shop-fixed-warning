import ClipLoader from 'react-spinners/ClipLoader';
import React from 'react';
import { LoaderContainer } from './styles.js';




export default function Loader() {
    return (
      <LoaderContainer>
        <ClipLoader
        size={75}
        color='#8cc84b'
        loading={true}
        />
      </LoaderContainer>
    )
  }