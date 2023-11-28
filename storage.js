const {Storage} = require('@google-cloud/storage')
require('dotenv').config()
const projectId=process.env.PROJECT_ID
const keyFilename=process.env.FILE_KEY_NAME
const storage = new Storage({projectId, keyFilename})
const bucket = storage.bucket(process.env.BUCKET_NAME)
async function uploadFile(file,fileDestination){
    try{
        const ret = await bucket.upload(file,{
            destination:`images/${fileDestination}`
        })
        return{
            ret
        }
    }catch(error){
        console.error('Error, ',error)
    }
}
(async()=>{
    const ret = await uploadFile("test.txt", "tesUpload.txt")
    console.log(ret)
})