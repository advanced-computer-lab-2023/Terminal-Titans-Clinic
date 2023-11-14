import AcceptRejectDoctor from "../components/AcceptRejectDoctor.jsx";

function AdminPage(){
    return(
        <div>
            
            <h1>Admin Page</h1>
            <div style={{textAlign:'right'}}>
            <button type="button" className="btn btn-success" 
        onClick={() => window.location.pathname = '/Health-Plus/changePassword'}>
        Change Password
      </button>
      
      <button type="button" className="btn btn-success" style={{marginLeft: '10px'}}
        onClick={() => window.location.pathname = '/Health-Plus/forgotPassword'}>
        Forgot Password
      </button>
      </div>
            <AcceptRejectDoctor />
        </div>
    )
}
export default AdminPage;