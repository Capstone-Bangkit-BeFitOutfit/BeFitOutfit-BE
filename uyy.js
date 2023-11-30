const {Storage} = require('@google-cloud/storage')
require('dotenv').config()
const projectId='befitoutfit'
const keyFilename="befitoutfit-7bfe6606f1fe"
const storage = new Storage({projectId, keyFilename})
async function uploadFile(file,fileDestination){
    try{
        const bucket = storage.bucket("befitoutfit")
        const ret = await bucket.upload(file,{
            destination:fileDestination
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