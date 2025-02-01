
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../lib/mongo";
import Blog from '../../../model/Blog-model'




connect()


export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { title, subtitle, category, content, image } = reqBody;

        const newReview = new Blog({
            title,
            subtitle,
            category,
            content,
            image
        });

        const review = await newReview.save();

        return NextResponse.json({
            message: "Review created successfully",
            success: true,
            review
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
        }
}