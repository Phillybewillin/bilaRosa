import React from "react";
import { UserAuth } from "../../context/AuthContext";
//import { useFirestore } from "../../Firestore";
import './account.scss';
import footerbg from '../../assets/footer-bg.webp';
import SavedShows from "./SavedShows";
import '../home.scss'
import Avatar from "react-avatar";
import SavedMovies from "./SavedMovies";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
const Account = () => {
  const{ user } = UserAuth();
  document.title = "My Library | ZILLA-XR";
  const fbg = footerbg;
  const email = user?.email;
  const username = email.split('@')[0];
  const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
  const [continueWatching, setContinueWatching] = React.useState(
    JSON.parse(localStorage.getItem('ContinueWatching')) || []
  );
  const handleDelete = (id) => {
    const newContinueWatching = continueWatching.filter((item) => item.id !== id);
    localStorage.setItem('ContinueWatching', JSON.stringify(newContinueWatching));
    setContinueWatching(newContinueWatching);
  }; 
  const navigate = useNavigate();

  const handleCardClick = (id , category ) => {
     navigate(`/${category}/${id}`);
  }
  const clearContinueWatching = () => {
    localStorage.removeItem('ContinueWatching');
    setContinueWatching([]);
  };
 // Output: "user"
 //console.log(user)
    return (
        <>
        <div className="bgblur" style={{
    backgroundImage: `url(${fbg})`,
  
}}>
   <div className="account" style={{
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)', // for Safari
}}>
              <div className="user">
                <div className="userAvator">
                 <Avatar 
                  name={user?.email}
                  round
                  size="100"
                  color="#000000d9"
                 />
                </div>
                <div className="userName">
                  <h1 className="User"> Hello , {capitalizedUsername}</h1>
                  <h6 className="userem"><i class='bx bxs-user-check'></i> u/{username}
                  </h6>
                </div>
                <div className="someshit">
                  <div className="shit">
                  <a href="https://discord.gg/MCt2R9gqGb" target="_blank">
  <div className="shi">
    <i className='bx bxl-discord-alt'></i>
  </div>
</a>

<a href="https://ko-fi.com/zillaxr" target="_blank">
  <div className="shi">
    <i className='bx bxs-heart'></i>
  </div>
</a>
                      <div className="shi">
                      <i className='bx bxs-bot'></i>
                      </div>
                      <div className="shi" onClick={()=> navigate("/z/movie")}>
                     <i className='bx bx-plus-medical'></i>
                      </div>
                      
                  </div>
                </div>
              </div>
              
              <div className="accountle">
                
            <SavedMovies />
              </div>
              {continueWatching?.length === 0 && (
        <div className="load">No History</div>
      )}
       {continueWatching?.length > 0 && (
              <div className="history">
                <h3 className="dh">Device History</h3>
                <div className="clear" onClick={clearContinueWatching}>
                  Delete All 
                <i class='bx bxs-trash'></i>
                </div>
            <div className="continue_watchingcontainer">
              <div className="contin">
          {continueWatching.map((item) => (
            <div className="continuewatching" key={item.id}>
              <img
                className="movieimage"
                loading='lazy'
                src={`https://image.tmdb.org/t/p/w200/${item.poster_path}`}
                onClick={() => handleCardClick(item.id, item.category, item.title || item.name, item.poster_path)}
                alt={item.title}
              />
              <p className="movietitle"  onClick={() => handleCardClick(item.id, item.category)}
               >{item.title || item.name}</p>
              <i
                onClick={() => handleDelete(item.id)}
                className="bx bxs-trash"
                style={{
                  color: 'orange',
                  fontSize: '20px',
                  cursor: 'pointer',
                  position: 'absolute',
                  bottom: '7px',
                  right: '1px'
                  
                }}
              ></i>
            </div>
          ))}
        </div>
        <div/>
      </div>
      </div>
      )}
      
              </div>
           
           
            </div>
            <div className="load">ZILLAXR</div>

      
        <ToastContainer theme="dark"/>  
        </>
    )
}

export default Account;
