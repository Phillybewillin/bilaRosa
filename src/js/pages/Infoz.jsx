import React from "react";
import alien from "../assets/icons8-alien-monster-emoji-48.png";
import { useNavigate } from "react-router-dom"
const info = () => {
    return <div className="infooo" style={{display : 'flex', flexDirection : 'column', justifyContent : 'flex-start', alignItems : 'flex-start', gap : '1rem',padding : '1rem',margin : '2rem',borderRadius : '10px',color : 'grey',width: '94vw',fontSize:"12px"}}>
       
        <h2>WELCOME TO Zilla-XR</h2>
        <h3>What is Zilla-XR?</h3>
        <p>Zilla-XR is a streaming platform that offers a wide range of immersive and entertainment content. </p>
        <ul>
            <li><strong>Unmatched Selection:</strong> Explore a diverse range of  movies, shows and more.</li>
            <li><strong>Cutting-Edge Technology:</strong> Enjoy seamless streaming and high-quality movies and shows, optimized for a smooth and immersive experience.</li>
            <li><strong>Constantly Evolving:</strong> We are always adding new and exciting content to keep you coming back for more.</li>
        </ul>
        <h3>Do I need an account to use the website?</h3>
        <p>Not Really, but creating a free account allows you to:</p>
        <ul>
            <li>Build and manage your watchlist for easy access to your favorite content.</li>
            <li>Keep track of your viewing history.</li>
            
        </ul>
        <h3>How can I manage my watchlist and favs?</h3>
        <p>Once you have an account, you can easily add content to your watchlist and favorites list directly from the Zilla-XR platform. You can access and manage your lists anytime through your profile settings.</p>
        <h3>How much does it cost?</h3>
        <p>It is free to use , and you dont need to pay anything to use Zilla-XR.</p>
          <h3>How can I watch?</h3>
        <p>Zilla-XR is accessible through various devices like TV 📺, PC  ,Laptops 💻 , and even your mobile phone 📱 </p>
        <h3>Is it legal to use Zilla-XR?</h3>
        <p>Absolutely! Zilla-XR only offers legally obtained and licensed content. We take copyright protection seriously and have robust measures in place to ensure compliance with DMCA regulations.</p>
        <h3>DMCA & Registration Info</h3>
        <p>Zilla-XR respects the intellectual property rights of others. We do not claim any intellectual property rights and we do not claim ownership of any content.</p>
        <ul>
            <li><strong>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement,</strong> please visit our dedicated DMCA takedown page for instructions on how to report the infringement.</li>
            <li><strong>We also provide clear and easy-to-find registration information</strong> on our website. This typically includes details like company address, contact information, and relevant legal disclaimers.</li>
        </ul>
        <h3>Contact</h3>
        <p>feel fee to contact us through the provided social media handles, if your having any problem with the website</p>
        <h3>Ads</h3>
        <p>Ads are not part of the Zilla-XR platform.</p>
    </div>;
    
};
export default info;
