import { NextResponse } from 'next/server';

export async function GET() {
    const stations = [
        { id: 1, name: "Ameerpet EV Fast Charger", location: "Hyderabad", slots: 4, type: "CCS2" },
        { id: 2, name: "Gachibowli Charging Hub", location: "Hyderabad", slots: 2, type: "Type 2" },
        { id: 3, name: "Hitech City EV Station", location: "Hyderabad", slots: 6, type: "CCS2" }
    ];

    return NextResponse.json(stations);
}