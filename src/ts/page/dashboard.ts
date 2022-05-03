//================= profiling ==========================
const MEMBER_API_URL=`${process.env.API_URL}/members`;
const BOOK_API_URL=`${process.env.API_URL}/v2/books`;
const ISSUE_API_URL=`${process.env.API_URL}/issues`;
const RETURN_API_URL=`${process.env.API_URL}/returns`;
//======================================================

sendHttpRequest(MEMBER_API_URL,(response)=>console.log(response));
sendHttpRequest(BOOK_API_URL,(response)=>console.log(response));
// sendHttpRequest(ISSUE_API_URL,(response)=>console.log(response));
// sendHttpRequest(RETURN_API_URL,(response)=>console.log(response));

function sendHttpRequest(url:string,successFn:(response:any)=>void,errorFn?:(status:number)=>void):void{
    const http = new XMLHttpRequest();
    http.onreadystatechange=()=>{
        if (http.readyState === http.DONE){
            if (http.status===200){
                successFn(http.responseText);
            }else {
                if (errorFn)errorFn(http.status);
            }
        }
    }

    http.open('GET',url,false);
    http.send();

}