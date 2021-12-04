import React, { Component } from 'react'; 
import './LeaderBoard.css'
//import ReactTable from "react-table";

class LeaderBoard extends Component {  
    render() {  
       const data = [{  
         
           }]  
       const columns = [{  
         Header: 'Rank',  
         accessor: 'rank'  
         },{  
         Header: 'Name',  
         accessor: 'name'  
         },{
             Header: 'Score', 
             accessor: 'score' 
         }]  
      return (  
            <div className="rank">  
                {/* <ReactTable  
                    data={data}  
                    columns={columns}  
                    defaultPageSize = {3}  
                    pageSizeOptions = {[2,4, 6]}  
                />   */}
            </div>        
      )  
    }  
  }  
  

export default LeaderBoard;
