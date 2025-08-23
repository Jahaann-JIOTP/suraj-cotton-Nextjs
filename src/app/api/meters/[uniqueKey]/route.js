import { connectDB } from "../../../../lib/mongodb";
import Meter from "../../../../../models/Meter";
import MeterName from "../../../../../models/MeterName";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const uniqueKey = params?.uniqueKey?.trim();
    if (!uniqueKey) {
      return NextResponse.json(
        { message: "Unique key not provided" },
        { status: 400 }
      );
    }

    // 🔹 Basic info from meter_name collection
    const meterInfo = await MeterName.findOne(
      { unique_key: uniqueKey },
      { _id: 0, meter_name: 1, location: 1, unique_key: 1 }
    ).lean();

    if (!meterInfo) {
      return NextResponse.json(
        { message: "Meter not found in meter_name collection" },
        { status: 404 }
      );
    }

    // 🔹 Details from meters collection
    const meterData = await Meter.findOne(
      { unique_key: uniqueKey },
      {
        _id: 0,
        parameters: 1,
        comment: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    ).lean();

    return NextResponse.json(
      {
        unique_key: meterInfo.unique_key,
        meter_name: meterInfo.meter_name,
        location: meterInfo.location,
        comment: meterData?.comment || "",
        parameters: meterData?.parameters || [],
        createdAt: meterData?.createdAt || null,
        updatedAt: meterData?.updatedAt || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching meter:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
