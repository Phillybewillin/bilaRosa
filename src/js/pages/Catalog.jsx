import React from 'react';

import { useParams } from 'react-router';

import MovieGrid from '../components/movie-grid/MovieGrid';

const Catalog = () => {

    const { category } = useParams();

    return (
        <>
            <div className="containerr">
                <div className="sect">
                    <MovieGrid category={category}/>
                </div>
            </div>
        </>
    );
}

export default Catalog;

