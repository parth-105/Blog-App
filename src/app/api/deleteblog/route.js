import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../lib/mongo";
import Blog from '../../../model/Blog-model'







export async function POST(request) {

    await connect();

    try {
        const reqBody = await request.json()

        const { id } = reqBody
    
        const result = await Blog.findByIdAndDelete(id);
        if (!result) {
            return NextResponse.json({ message: 'blog not found' });
        }
        return NextResponse.json({ message: 'blog deleted successfully', Success: true });
    } catch (error) {
       
        return NextResponse.json({ message: 'Internal server error' });
    }

}
