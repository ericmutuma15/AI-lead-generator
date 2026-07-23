import request from "./api";


const BUSINESS_ID = "biz1";



/*
  Fetch dashboard analytics
*/

export async function getAnalytics(){

  return request(
    `/insights?business_id=${BUSINESS_ID}`
  );

}






/*
  Optional: fetch dashboard summary
  Useful later if backend separates endpoints
*/

export async function getDashboardStats(){

  return request(
    `/dashboard/stats?business_id=${BUSINESS_ID}`
  );

}






/*
  Lead activity feed
  Used by ActivityFeed component
*/

export async function getActivities(){

  return request(
    `/activities?business_id=${BUSINESS_ID}`
  );

}