import api, { BUSINESS_ID } from "./api";

export async function getDashboard() {
    const [leads, insights] = await Promise.all([
        api(`/leads?business_id=${BUSINESS_ID}`),

        api(`/insights?business_id=${BUSINESS_ID}`),
    ]);

    return {
        leads,
        insights,
    };
}