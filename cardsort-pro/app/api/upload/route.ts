// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { records, adminId } = await req.json();

  try {
    const formatted = records.map((row: any) => ({
      jobId: row["job Id"] || row.jobId || null,
      serialNumber: parseInt(row["S/N"] || row.serialNumber) || null,
      state: row.state,
      lga: row.lga,
      ward: row.ward,
      accountName: row.account_name || row["account_name"],
      accountNumber: row.account_number || row["account_number"],
      maskPan: row.mask_pan || row["mask_pan"],
    }));

    await prisma.cardRecord.createMany({
      data: formatted,
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: `✅ ${formatted.length} records processed successfully!`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
