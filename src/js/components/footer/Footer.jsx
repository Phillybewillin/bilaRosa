import React from "react";
import './footer.scss';
import { Link } from 'react-router-dom';
//import logo from '../../assets/icons8-alien-monster-emoji-48.png';
export const Footer = () => {

    return (
        <div className="footer" loading="lazy">
               
                
                <div className="footer__content__logo">
                   <div className="xilla"><h1>ZILLAXR</h1></div>
                    <div className="xilla">
                    <a href="https://discord.gg/MCt2R9gqGb" target="_blank" rel="noreferrer"><i className='bx bxl-discord-alt' style={{color: 'crimson', fontSize: '35px',padding : '5px',borderRadius : '5px' ,marginLeft:"5px"}}></i></a>
                        
                    <a href="https://t.me/+MQUUqEx2WXA0ZmZk" target="_blank" rel="noreferrer"><i className="bx bxl-telegram" style={{color: 'aqua', fontSize: '30px',padding : '5px',borderRadius : '5px' ,marginLeft:"5px"}}></i></a>
    
                    </div>
                   
                </div>
                <div className="footer__content__menus">
                <div className="footer__content__menu">
              
                        <p className="Diss">Disclaimer:

This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services. All contents are provided by non-affiliated third parties.</p>
                        </div>
                    <div className="footer__content__menu">
                      <div className="links">
                        <Link to="/">Home</Link>
                       <div className="splitter"></div>
                       <Link to="/filter">Filters</Link>
                        <div className="splitter"></div>
                        <Link to="/movie">Movies</Link>
                        <div className="splitter"></div>
                        <Link to="/tv">TV Series</Link>
                       </div>
                       
                       
                   </div>
                    
                    <div className="footer__content__menu">
                    <div className="links">
                        <Link to="/dmca">DMCA</Link>
                        <div className="splitter"></div>
                        <Link to="/contact">Contact</Link>
                        <div className="splitter"></div>
                        <Link to="/aboutzilla">About</Link>
                        <div className="splitter"></div>
                        <Link to="/privacypolicy">Privacy Policy</Link>
                         </div>
                       </div>
                </div>
                </div>
    );
}

export default Footer;
