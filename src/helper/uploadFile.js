const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`


const uploadFile = async(file)=>{
  try{
 
    const formData = new FormData()
    formData.append('file',file)
    formData.append("upload_preset","chat-app-file")

    const response = await fetch(url,{
        method : 'post',
        body : formData
    })
    const responseData = await response.json()


    return responseData
  }
  catch(err){
    return('uplod url err',err.message)
  }
}

export default uploadFile