import React from "react";

import './account.scss';

import SavedShows from "./SavedShows";

import SavedMovies from "./SavedMovies";

const Account = () => {

    return (
        <>
            <div className="account">
              <div className="accountleft">
                <h3 className="account__title">Saved Movies</h3>
            <SavedMovies />
              </div>
            <div className="accountright">
               <h3 className="account__title">Saved Shows</h3>
            <SavedShows />
            </div>
           
            </div>
           
        </>
    )
}

export default Account;
