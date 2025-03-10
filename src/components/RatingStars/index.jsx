import React from 'react';
import { FaStar } from 'react-icons/fa';
const StarRating = ({ avaliacao }) => {
    const estrelasTotais = 5;
    const estrelasPreenchidas = Math.round(avaliacao);
  
    return (
      <div>
        {[...Array(estrelasTotais)].map((star, index) => (
          <FaStar
            key={index}
            color={index < estrelasPreenchidas ? '#ffc107' : '#e4e5e9'}
          />
        ))}
      </div>
    );
  };
  
  export default StarRating;