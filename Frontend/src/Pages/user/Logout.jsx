import React from 'react'

const Logout = () => {
    const logOut = () =>{
      if(window.confirm("are you sure you want to log out")){
      localStorage.removeItem("userToken")
      window.location.href = '/dashboard/account'
      }
    }
  return (
    <div>
        <p>
            Click the button below to confirm your log out session
        </p>
        <button onClick={logOut}>Logout</button>
    </div>
  )
}

export default Logout