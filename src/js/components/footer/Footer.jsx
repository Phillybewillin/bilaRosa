import React from "react";
import './footer.scss';
import { Link } from 'react-router-dom';
//import logo from '../../assets/icons8-alien-monster-emoji-48.png';
export const Footer = () => {

    return (
        <div className="footer" loading="lazy">
               
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
                        <Link to="/info">About</Link>
                        <div className="splitter"></div>
                        <Link to="/socials">Privacy Policy</Link>
                         </div>
                       </div>
                </div>
                <div className="footer__content__logo">
                   <div className="logo">
                       <Link to="/">Made by some guy</Link>
                       <i className='bx bxs-basketball bx-spin' style={{color: 'white', fontSize: '15px' ,paddingLeft: "7px"}}></i>
                    </div>
                    <div className="xilla"><h1>ZILLA-XR</h1></div>
                    <div className="acca">
                    <a href="https://buymeacoffee.com/zillaxr.xyz" target="_blank" rel="noreferrer"><i className='bx bxs-donate-heart' style={{color: 'pink', fontSize: '25px' ,backgroundColor:"black", padding:"5px" ,borderRadius:"5px" ,marginLeft:"5px"}}></i></a>

                    
                    <a href="https://t.me/+MQUUqEx2WXA0ZmZk" target="_blank" rel="noreferrer"><i className="bx bxl-telegram" style={{color: 'white', fontSize: '25px',padding : '5px',backgroundColor : 'black',borderRadius : '5px' ,marginLeft:"5px"}}></i></a>
                    <a href="https://reddit.com/r/zillaXRxyz" target="_blank " rel="noreferrer"><i className="bx bxl-reddit"style={{color: 'white',fontSize: '25px',padding : '5px',backgroundColor : 'black',borderRadius : '5px',marginLeft:"5px"}}></i></a>
                    <a href="https://x.com/ZillaXRxyz" target="_blank" rel="noreferrer"><i className="bx bxl-twitter" style={{color: 'aqua', fontSize: '25px' ,backgroundColor:"black", padding:"5px" ,borderRadius:"5px" ,marginLeft:"5px"}}></i></a>
                  
                    </div>
                   
                </div>
                <div className="acc"><i className=" bx bx copyright" style={{color: 'white', fontSize: '11px' ,paddingLeft: "7px"}}> </i> <h5>© zilla-xr.xyz</h5> <h6>@2024.</h6></div>
            </div>
    );
}

export default Footer;
