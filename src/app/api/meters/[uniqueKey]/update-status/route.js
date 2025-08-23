import { connectDB } from "../../../../../lib/mongodb";
import Meter from "../../../../../../models/Meter";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const uniqueKey = params?.uniqueKey?.trim();
    if (!uniqueKey) {
      return NextResponse.json(
        { error: "Unique key not provided" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { paramName, newStatus, comment } = body;

    if (!paramName && typeof comment !== "string") {
      return NextResponse.json(
        { error: "paramName or comment must be provided" },
        { status: 400 }
      );
    }

    const meter = await Meter.findOne({ unique_key: uniqueKey });
    if (!meter) {
      return NextResponse.json(
        { error: "Meter not found in meters collection" },
        { status: 404 }
      );
    }

    let statusUpdated = false;
    let commentUpdated = false;

    // ✅ Update parameter status
    if (paramName && newStatus) {
      const param = meter.parameters.find((p) => p.paramName === paramName);

      if (!param) {
        return NextResponse.json(
          { error: `Parameter ${paramName} not found` },
          { status: 404 }
        );
      }

      if (param.status !== newStatus) {
        param.status = newStatus;
        statusUpdated = true;
      }
    }

    // ✅ Update comment
    if (typeof comment === "string") {
      const trimmedComment = comment.trim();
      if (meter.comment !== trimmedComment) {
        meter.comment = trimmedComment;
        commentUpdated = true;
      }
    }

    if (!statusUpdated && !commentUpdated) {
      return NextResponse.json(
        { success: false, message: "Nothing to update" },
        { status: 200 }
      );
    }

    await meter.save();

    const responsePayload = {
      success: true,
      createdAt: meter.createdAt,
      updatedAt: meter.updatedAt, // mongoose timestamps auto-update hoga
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("Error updating meter:", error);
    return NextResponse.json(
      { error: "Failed to update meter" },
      { status: 500 }
    );
  }
}
