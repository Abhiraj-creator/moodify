

const ImageKit= require('@imagekit/nodejs').default

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const upload=async ({buffer,filename,folder=""})=>{
   const file= await client.files.upload({
        file:await ImageKit.toFile(Buffer.from(buffer)),
        fileName:filename,
        folder
    })
    return file
}

module.exports={upload}
