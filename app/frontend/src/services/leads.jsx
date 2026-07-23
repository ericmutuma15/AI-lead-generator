import request from "./api";


const BUSINESS_ID = "biz1";



/*
  Get all leads
*/

export async function getLeads(){

  return request(
    `/leads?business_id=${BUSINESS_ID}`
  );

}





/*
  Get single lead
*/

export async function getLead(
  id
){

  return request(

    `/leads/${id}?business_id=${BUSINESS_ID}`

  );

}






/*
  Create lead
*/

export async function createLead(
  data
){

  return request(

    "/capture",

    {

      method:"POST",

      body:JSON.stringify({

        ...data,

        business_id:
          BUSINESS_ID,

      }),

    }

  );

}







/*
  Delete lead
*/

export async function deleteLead(
  id
){

  return request(

    `/leads/${id}?business_id=${BUSINESS_ID}`,

    {

      method:"DELETE",

    }

  );

}







/*
  Update lead
*/

export async function updateLead(
  id,
  data
){

  return request(

    `/leads/${id}?business_id=${BUSINESS_ID}`,

    {

      method:"PUT",

      body:JSON.stringify(
        data
      ),

    }

  );

}







/*
  Messages
*/

export async function getMessages(
  id
){

  return request(

    `/leads/${id}/messages?business_id=${BUSINESS_ID}`

  );

}






export async function sendMessage(
  id,
  message
){

  return request(

    `/leads/${id}/messages?business_id=${BUSINESS_ID}`,

    {

      method:"POST",

      body:JSON.stringify({

        message,

        sender:"business"

      }),

    }

  );

}