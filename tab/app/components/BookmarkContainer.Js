import React, { Component } from 'react';
import Bookmark from './Bookmark';


const SearchBar = () => 
    <div>
        <input type="text" value="jjjjqy" contentEditable="true"></input>
    </div>; 


class BookmarkContainer extends Component{

    state = {
        bookmarks: [
            {
              "bId": "-M50v_SnkBt033E-QgkY",
              "title": "Extensions",
              "url": "chrome://extensions/",
              "favicon": "../../icons/icon48.png",
              "tags": [
                "does",
                "this",
                "happed",
                "again"
              ],
              "clicks": 0,
              "isDeleted": false
            },
            {
              "bId": "-M50vbLUqDWIlCyOmygT",
              "title": "java - Setting custom key when pushing new data to firebase database - Stack Overflow",
              "url": "https://stackoverflow.com/questions/37483406/setting-custom-key-when-pushing-new-data-to-firebase-database",
              "favicon": "https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico?v=4f32ecc8f43d",
              "tags": [
                "stack",
                "overflow"
              ],
              "clicks": 0,
              "isDeleted": false
            },
            {
              "bId": "-M50vfFBX5LrUKrxEb5x",
              "title": "SSVM - Microsoft Azure",
              "url": "https://portal.azure.com/#@samseabourn.onmicrosoft.com/resource/subscriptions/773e0c90-d5b3-413f-a351-f9448f027262/resourceGroups/SamSeabournWork/providers/Microsoft.Compute/virtualMachines/SSVM/overview",
              "favicon": "https://portal.azure.com/favicon.ico",
              "tags": [
                "azure",
                "vm",
                "link",
                "work",
                "solentive"
              ],
              "clicks": 0,
              "isDeleted": false
            },
            {
              "bId": "-M50voPYJovRW31T8svX",
              "title": "Slinky – Firebase console",
              "url": "https://console.firebase.google.com/u/0/project/slinky-0001/database/slinky-0001/data/~2F",
              "favicon": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/favicon.ico",
              "tags": [
                "firebase",
                "google",
                "api",
                "learning"
              ],
              "clicks": 0,
              "isDeleted": false
            },
            {
              "bId": "-M50vv8U0moQdIA0Why6",
              "title": "Payroll | My Payroll",
              "url": "https://payroll.xero.com/EmployeePortal/PayRunHistory/Details/289261216?CID=!zmJKG",
              "favicon": "https://edge.xero.com/images/1.0.0/favicon/favicon.ico",
              "tags": [
                "xero",
                "fianace",
                "cash",
                "invoicing",
                "worktool"
              ],
              "clicks": 0,
              "isDeleted": false
            }
          ],
        currentSearch: "" 
    }

    render(){
        return(
            <div className="bookmarkcontainer-flexbox">
                <div className="search-area">
                    <SearchBar />
                    <div className="slinky-search-underscore"></div>
                    <div className="bookmark-container">
                        {this.state.bookmarks.map((bookmark) => <Bookmark key={bookmark.bId} bookmark={bookmark}/>)}
                    </div> 
                </div>
            </div>
        )
    }
}

export default BookmarkContainer