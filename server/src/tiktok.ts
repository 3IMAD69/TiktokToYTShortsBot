import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import {path as ffmpegProbe} from '@ffprobe-installer/ffprobe';

import ffmpeg from 'fluent-ffmpeg';
import { TiktokDL } from "@tobyg74/tiktok-api-dl"
import Downloader from "nodejs-file-downloader"
import { UploadShorts } from './UploadShorts';
import getVideoDurationInSeconds from 'get-video-duration';
import { GetReelDetailsV2 } from './instagram';
import { updateStatus } from './server';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffmpegProbe);

let Title :string ;
let Description :string | undefined ;
let LinkID : string ;

//ScaledOnly('input')
//RenderWithLogoAndFilter()
// AddFilterAndScaleUP('input')
//RenderWithLogoWithOutFilter();zzzzzz
async function RenderWithLogoAndFilter(watermark:boolean) {
  return new Promise<void>((resolve,reject)=>{
    ffmpeg()
    .input('ffmpeg-auto/input.mp4')
    .input('ffmpeg-auto/Logo.png')
    .complexFilter([
      '[1][0]scale2ref=w=iw/3:h=ow/mdar[logo][main]',
      '[main][logo]overlay=x=(main_w-overlay_w)/2:y=(main_h-overlay_h)-10'
    ])
    .videoCodec('libx264')
    .audioCodec('copy')
    .outputOptions('-qp 19')
    .output('ffmpeg-auto/logoded.mp4')
    .on('end',async () => {
      console.log('Processing finished , Logo Added');
      console.log(Title +' '+Description)
      await AddFilterAndScaleUP('logoded',watermark);
    })
    .on('progress', function(progress) {
      if (progress && progress?.percent)
      {
        console.log('Processing: ' + progress.percent.toFixed(2) + '%');
        updateStatus("ADDING LOGO "+ progress.percent.toFixed(2) + "%");
      }
    })
    .on('error', (err) => {
      console.error('Error:', err);
    })
    .run();
  })
   
}

async function RenderWithLogoWithOutFilter(watermark:boolean) {
  return new Promise<void>((resolve,reject)=>{
    ffmpeg()
    .input('ffmpeg-auto/input.mp4')
    .input('ffmpeg-auto/Logo.png')
    .complexFilter([
      '[1][0]scale2ref=w=iw/3:h=ow/mdar[logo][main]',
      '[main][logo]overlay=x=(main_w-overlay_w)/2:y=(main_h-overlay_h)-10'
    ])
    .videoCodec('libx264')
    .audioCodec('copy')
    .outputOptions('-qp 19')
    .output('ffmpeg-auto/logoded.mp4')  
    .on('end',async () => {
      console.log('Processing finished , Logo Added');
      console.log(Title +' '+Description)
      await ScaledOnly('logoded',watermark);
      resolve();
    })
    .on('progress', function(progress) {
      if (progress && progress?.percent)
      {
        console.log('Processing: ' + progress.percent.toFixed(2) + '%');
        updateStatus("ADDING LOGO "+ progress.percent.toFixed(2) + "%");
      }
    })
    .on('error', (err) => {
      console.error('Error:', err);
      reject();
    })
    .run();

  })
   
}


async function AddFilterAndScaleUP(filename:string,watermark:boolean){
  return new Promise<void>((resolve,reject)=>{
    ffmpeg('ffmpeg-auto/'+filename+'.mp4')
    .videoFilters([
      'scale=1440:2560:flags=lanczos,eq=contrast=1.1:brightness=-0.07:saturation=1.2,setdar=9/16,unsharp=7:7:1:7:7:0'
    ])
    .videoCodec('libx264')
    .audioCodec('copy')
    .outputOptions('-qp 19')
    .duration(59)
    .output('ffmpeg-auto/output.mp4')
    .on('end', async() => {
      console.log('Processing finished Ready To Upload');
      if (watermark)
        await RenderWithWaterMark("output")
      else
        await UploadShorts('output',Title,Description,LinkID)
      resolve()
    })
    .on('progress', function(progress) {
      if (progress && progress?.percent)
      {
        console.log('Processing: ' + progress.percent.toFixed(2) + '%');      
        updateStatus("ADDING FILTER "+ progress.percent.toFixed(2) + "%");
      }
      })
    .on('error', (err) => {
      console.error('Error:', err);
      reject();
    })
    .run();
  })
}

async function ScaledOnly(filename:string,watermark:boolean){
  return new Promise<void>((resolve,reject)=>{
    ffmpeg('ffmpeg-auto/'+filename+'.mp4')
  // .outputOptions('-c:v h264_qsv')
  .videoCodec('libx264')
  .audioCodec('copy')
  .videoFilters([
    'scale=1440:2560:flags=lanczos,setdar=9/16,unsharp=7:7:1:7:7:0'
  ])
  .duration(59)
  .outputOptions('-qp 19')
  .output('ffmpeg-auto/output.mp4')
  .on('end', async () => {
    console.timeEnd("time : ");
    console.log('Processing finished Ready To Upload');
    if (watermark)
      await RenderWithWaterMark('output');
    else
      await UploadShorts('output',Title,Description,LinkID)
    resolve();
  })
  .on('progress', function(progress) {
   // console.log('Processing: ' + progress.percent.toFixed(2) + '%');
   if (progress && progress?.percent)
   {
     console.log('Processing: ' + progress.percent.toFixed(2) + '%');
     updateStatus("SCALING "+ progress.percent.toFixed(2) + "%");
   }
    })
  .on('error', (err) => {
    console.error('Error:', err);
    reject();
  })
  .run();
  })
  
}

async function RenderWithWaterMark(filename:string) {
  return new Promise<void>((resolve,reject)=>{
    ffmpeg()
    .input('ffmpeg-auto/'+filename+'.mp4')
    .input('ffmpeg-auto/watermark.png')
    .complexFilter([
      "[0:v]scale=1080:-1[bg];[bg][1:v]overlay=W-w-10:H-h+200"
    ])
    .videoCodec('libx264')
    .audioCodec('copy')
    .outputOptions('-qp 19')
    .output('ffmpeg-auto/watermaked.mp4')
    .on('end',async () => {
      console.log('Processing finished , Watermark Added');
      await UploadShorts('watermaked',Title,Description,LinkID)
      resolve();
    })
    .on('progress', function(progress) {
      if (progress && progress?.percent)
      {
        console.log('Watermarking Processing: ' + progress.percent.toFixed(2) + '%');
        updateStatus("WATERMARKING "+ progress.percent.toFixed(2) + "%");
      }
    })
    .on('error', (err) => {
      console.error('Error:', err);
      reject();
    })
    .run();
  })  
}

async function HandleRenderLogic(downloader:Downloader,logo:boolean,filter:boolean,watermark:boolean)
{
  try {
    const {filePath,downloadStatus} = await downloader.download(); //Downloader.download() resolves with some useful properties.

    console.log("Download Tiktok Completed");
    if(logo && filter) {
      console.log('Rendering With Logo + Filter + ScaleUP ')
      await RenderWithLogoAndFilter(watermark);
    }
    if(logo && !filter){
      console.log('Rendering With Logo + ScaleUP ')
      await RenderWithLogoWithOutFilter(watermark)
    }
    if(!logo && filter){
      console.log('Rendering With Filter + ScaleUP ')
      await AddFilterAndScaleUP('input',watermark)
    }
    if(!logo && !filter){
      console.time("time : ");
      console.log('Rendering With ScaleUP Only')
      await ScaledOnly('input',watermark)
    }
    
} catch (error) {
    //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
    //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
    updateStatus("Failed To upload");
    console.log("Download failed", error);
}
}

export async function HandleFromTiktok(tiktok_url:string,logo:boolean,filter:boolean,watermark:boolean,IdLink:string){

        return TiktokDL(tiktok_url).then(async (result) => {
            if(result.status == "success"){
                if(typeof result.result?.video != 'undefined'){
                    console.log(result.result?.video[0])
                    Title =  result.result.description.replace(/#[^\s#]+/g,'').replace(/-/g,'') // mera mera kikun --- f title 7ydo
                    Description =  result.result.description.match(/#[^\s#]+/g)?.join(' ') || undefined
                    LinkID = IdLink; //id dyal link f mongodb bsh npassih luploadShorts bsh ila tuploada n7ydu 

                    const downloader = new Downloader({
                        url: result.result?.video[0], //If the file name already exists, a new file with the name 200MB1.zip is created.
                        directory: "./ffmpeg-auto", //This folder will be created, if it doesn't exist.   
                        fileName:'input.mp4',
                        cloneFiles:false, //This will cause the downloader to re-write an existing file.
                        maxAttempts:3,
                        onProgress: function (percentage, chunk, remainingSize) {
                            //Gets called with each chunk.
                            updateStatus("DOWNLOADING "+ percentage + "%");
                            process.stdout.write("Downloading tiktok % "+ percentage + "\r");
                          },
            
                    });
                    HandleRenderLogic(downloader,logo,filter,watermark);
                }
            }else{
              throw new Error('Something went wrong while getting tiktok details');
            }
        })
}


export async function HandleFromInstagram(ReelUrl:string,logo:boolean,filter:boolean,watermark:boolean,mongoId:string)
{
  const result = await GetReelDetailsV2(ReelUrl)
  if (result)
  {
    Title = result.title
    Description = result.description
    LinkID = mongoId
    const downloader = new Downloader({
        url: result.video,
        directory: "./ffmpeg-auto",
        fileName:'input.mp4',
        cloneFiles:false,
        maxAttempts:3,
        onProgress: function (percentage, chunk, remainingSize) {
          //Gets called with each chunk.
          updateStatus("DOWNLOADING "+ percentage + "%");
          process.stdout.write("Downloading reel % "+ percentage + "\r");
        },
    });
    HandleRenderLogic(downloader,logo,filter,watermark)
  }
}


  const GetTiktokDuration = async (tiklink:string) => {
        try{
            return getVideoDurationInSeconds(tiklink,'/usr/bin/ffprobe')
        }catch{
            return 0
        }
    }
    



export const GetTiktokInfo = async (tiktokLink:string) => {
    return TiktokDL(tiktokLink).then(async(result)=>{
      if(result.status == "success"){
        if(typeof result.result?.video != 'undefined'){
          const duration = await GetTiktokDuration(result.result?.video[0])
          return {
            Title :  result.result.description.replace(/#[^\s#]+/g,'').replace(/-/g,'').trim() ,
            Description :  result.result.description.match(/#[^\s#]+/g)?.join(' ') || undefined,
            dynamic_cover : result.result?.dynamic_cover?.[0] || undefined ,
            duration:Number(duration?.toFixed(2))
          }
          

        }
      }
    })
}

//HandleFromTiktok("https://www.tiktok.com/@vascolevrai/video/7240567363794504987",true,true)
