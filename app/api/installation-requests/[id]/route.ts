export const fetchCache = "force-no-store"
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const requestData = await prisma.installationRequest.findUnique({
      where: { id }
    })

    if (!requestData) {
      return NextResponse.json({ error: "Installation request not found" }, { status: 404 })
    }

    return NextResponse.json(requestData)
  } catch (error) {
    console.error("GET installation request error:", error)
    return NextResponse.json({ error: "Failed to fetch installation request" }, { status: 500 })
  }
}

// PUT
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const updated = await prisma.installationRequest.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT installation request error:", error)
    return NextResponse.json({ error: "Failed to update installation request" }, { status: 500 })
  }
}
