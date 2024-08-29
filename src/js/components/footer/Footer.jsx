import React from "react";
import './footer.scss';
import { Link } from 'react-router-dom';
//import logo from '../../assets/icons8-alien-monster-emoji-48.png';
export const Footer = () => {

    return (
        <div className="footer" loading="lazy">
                <div className="footer__content__logo">
                   <div className="logo">
                       <Link to="/">Made by Aliens</Link>
                        <i className="bx bxs-heart" style={{color: 'black', fontSize: '15px' ,paddingLeft: "10px"}}></i>
                    </div>
                    <div className="acca">
                    <a href="https://www.buymeacoffee.com/_.0__3__0._" target="_blank" rel="noreferrer"><i className="bx bx bxs-coffee" style={{color: 'pink', fontSize: '25px' ,backgroundColor:"black", padding:"5px" ,borderRadius:"5px"}}></i></a>
                  
                    <a href="https://t.me/+MQUUqEx2WXA0ZmZk" target="_blank" rel="noreferrer"><i className="bx bxl-telegram" style={{color: 'white', fontSize: '25px',padding : '5px',backgroundColor : 'aqua',borderRadius : '5px' ,marginLeft:"5px"}}></i></a>
                    <a href="https://reddit.com/r/zillaXRxyz" target="_blank " rel="noreferrer"><i className="bx bxl-reddit"style={{color: 'white',fontSize: '25px',padding : '5px',backgroundColor : 'red',borderRadius : '5px',marginLeft:"5px"}}></i></a>
                    
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
                       <Link to="/socials">Pivacy Policy</Link>
                       </div>
                       
                   </div>
                    
                    <div className="footer__content__menu">
                    <div className="links">
                    <Link to="/movie">Must Watch</Link>
                        <div className="splitter"></div>
                        <Link to="/account">Watch Later</Link>
                         </div>
                       </div>
                </div>
            </div>
    );
}

export default Footer;
