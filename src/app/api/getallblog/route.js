import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../lib/mongo";
import Blog from '../../../model/Blog-model'



connect()

export async function POST(request) {
    try {
   
    //   const reqBody = await request.json()
     
      const blog = await Blog.find({});
      // console.log('bb',blog)
        return NextResponse.json({
            message: "courses featch successfully",
            success: true,
            data:blog
        })
      } catch (error) {
       
        console.log('err',error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
        
      }
}